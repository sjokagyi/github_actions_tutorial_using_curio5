import os
import boto3
from django.core.management.base import BaseCommand
from datetime import datetime

class Command(BaseCommand):
    help = 'Upload data to S3'

    def handle(self, *args, **kwargs):

        AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
        BUCKET_NAME = os.getenv('CURIO_BUCKET_NAME')

        s3 = boto3.client('s3', 
                          aws_access_key_id=AWS_ACCESS_KEY_ID, 
                          aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
        bucket_name = 'BUCKET_NAME'  # Replace with your bucket name

        # Generate the S3 directory path based on the current date
        current_date = datetime.now().strftime('%Y/%m/%d')
        s3_directory = f'data/{current_date}/'  # This will create a structure like data/YYYY/MM/DD/

        local_directory = 'data/'  # Replace with your local data directory

        for root, dirs, files in os.walk(local_directory):
            for filename in files:
                local_path = os.path.join(root, filename)
                # Calculate the relative path of the file within the local directory
                relative_path = os.path.relpath(local_path, local_directory)
                # Combine the S3 directory and the relative path to get the full S3 key
                s3_key = os.path.join(s3_directory, relative_path).replace("\\", "/")  # Handle Windows paths

                try:
                    # Upload the file to S3
                    s3.upload_file(local_path, bucket_name, s3_key)
                    # Output the success message with the S3 key
                    self.stdout.write(self.style.SUCCESS(f'Successfully uploaded {local_path} to s3://{bucket_name}/{s3_key}'))
                except Exception as e:
                    # Output the error message with the S3 key
                    self.stdout.write(self.style.ERROR(f'Failed to upload {local_path} to s3://{bucket_name}/{s3_key}: {str(e)}'))

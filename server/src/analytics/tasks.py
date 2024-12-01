

from celery import shared_task
import subprocess
import os

@shared_task
def extract_data():
    script_path = os.path.join(os.path.dirname(__file__), '..', 'scripts', 'extract_data.py')
    print(f"Running script: {script_path}")
    result = subprocess.run(['python', script_path], capture_output=True, text=True)
    if result.returncode == 0:
        print(result.stdout)
        return result.stdout
    else:
        print(result.stderr)
        raise Exception(result.stderr)

@shared_task
def upload_data_to_s3():
    script_path = os.path.join(os.path.dirname(__file__), '..', 'analytics', 'management', 'commands', 'upload_data_to_s3.py')
    print(f"Running script: {script_path}")
    result = subprocess.run(['python', script_path], capture_output=True, text=True)
    if result.returncode == 0:
        print(result.stdout)
        return result.stdout
    else:
        print(result.stderr)
        raise Exception(result.stderr)

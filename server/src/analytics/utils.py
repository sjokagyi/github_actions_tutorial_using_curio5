import os
import boto3
import time

def execute_athena_query(query):
    # Provide your AWS credentials here
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_REGION = os.getenv('AWS_REGION', 'us-east-2')

    client = boto3.client(
        'athena',
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )

    query_start = client.start_query_execution(
        QueryString=query,
        QueryExecutionContext={
            'Database': 'curioanalyticsdb2'  # Replace with your database
        },
        ResultConfiguration={
            'OutputLocation': 's3://curioanalyticsbucket/'  # Replace with your S3 bucket
        }
    )

    query_execution_id = query_start['QueryExecutionId']

    # Wait for the query to complete
    while True:
        query_status = client.get_query_execution(QueryExecutionId=query_execution_id)
        status = query_status['QueryExecution']['Status']['State']
        if status in ['SUCCEEDED', 'FAILED', 'CANCELLED']:
            break
        time.sleep(1)

    if status == 'SUCCEEDED':
        result = client.get_query_results(QueryExecutionId=query_execution_id)
        columns = [col['Label'] for col in result['ResultSet']['ResultSetMetadata']['ColumnInfo']]
        rows = result['ResultSet']['Rows']
        data = []
        for row in rows[1:]:  # Skip header row
            data.append({columns[i]: col.get('VarCharValue', None) for i, col in enumerate(row['Data'])})
        return data
    else:
        return {'error': 'Query failed'}

import boto3
import os
import json

dynamodb = boto3.resource('dynamodb', region_name=os.getenv('REGION'))
table = dynamodb.Table(os.getenv('STORAGE_STATISTICS_NAME'))

def handler(event, context):
    try:
        body = json.loads(event['body'])
        user = body['user']
        filename = body['filename']

        item = table.get_item(Key={'user': user})
        if ('Item' in item):
            print('User exists in table')
        else:
            table.put_item(
                Item={
                    'user': user,
                    'uploads': {},
                    'stats':{
                        'uploadCount': 0,
                        'correctCount': 0,
                        'wrongCount': 0               
                    }
                }
            )
            print('User created in table')

        table.update_item(
            Key={
                'user': user
            },
            UpdateExpression='SET uploads.#key = :i ADD stats.uploadCount :inc',
            ExpressionAttributeNames={
                "#key": filename  
            },
            ExpressionAttributeValues={
                ':i': {
                    "category": None,
                    "feedback": None
                },
                ":inc": 1
            },
        )
        
        return {
        'statusCode': 200,
        'headers': {
            'Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': 'success'
    }
    except Exception as e:
        print(e)
        return {
        "statusCode": 500,
        "headers": {
            'Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': 'something happened'
    }
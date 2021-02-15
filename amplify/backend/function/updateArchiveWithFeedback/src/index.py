import boto3
import os
import json

dynamodb = boto3.resource('dynamodb', region_name=os.getenv('REGION'))
table = dynamodb.Table(os.getenv('STORAGE_STATISTICS_NAME'))

def handler(event, context):
    try:
        print(event)
        body = json.loads(event['body'])
        user = body['user']
        filename = body['filename']
        print(body['filename'])
        feedback = str(body['feedback'])
        
        expression = 'SET uploads.#key.feedback = #fb ADD stats.'
        adding = "";
        if feedback == "True":
            adding = 'correctCount '
        else:
            adding = 'wrongCount '
        
        expression += adding
        expression += ':inc'
        
        print(expression)
        print(filename)
        
        table.update_item(
            Key={
                'user': user
            },
            ExpressionAttributeNames={
                "#key": filename,
                "#fb": feedback
            },
            UpdateExpression=expression,
            ExpressionAttributeValues={
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
        }
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
        }
    }
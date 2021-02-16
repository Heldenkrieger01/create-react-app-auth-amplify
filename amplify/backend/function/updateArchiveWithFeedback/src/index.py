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
        feedback = str(body['feedback'])
        globalStats = 'globalStats'
        
        expression_globalStats = 'ADD stats.'
        expression = 'SET uploads.#key.feedback = :fb ADD stats.'
        adding = "";
        if feedback == "True":
            adding = 'correctCount '
        else:
            adding = 'wrongCount '
        
        expression += adding
        expression += ':inc'
        expression_globalStats += adding
        expression_globalStats += ':inc'
        
        table.update_item(
            Key={
                'user': user
            },
            UpdateExpression=expression,
            ExpressionAttributeNames={
                "#key": filename
            },
            ExpressionAttributeValues={
                ":inc": 1,
                ":fb": feedback
            },
        )
        
        table.update_item(
            Key={
                'user': globalStats
            },
            UpdateExpression=expression_globalStats,
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
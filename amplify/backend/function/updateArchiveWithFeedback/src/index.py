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
        category = body['category']
        if category == 'Undefined':
            category = 'NOT_DEFINED'
        globalStats = 'globalStats'
        
        expression_user = 'SET uploads.#key.feedback = :fb ADD stats.'
        expression_globalStats = 'ADD stats.'
        
        expression_count_to_add = ''
        if feedback == 'True':
            expression_count_to_add = 'correctCount :inc'
        else:
            expression_count_to_add = 'wrongCount :inc'
        
        expression_user += expression_count_to_add
        expression_globalStats += expression_count_to_add
        
        expression_part_category = ', stats.#c.'
        expression_part_category += expression_count_to_add
        expression_user += expression_part_category
        expression_globalStats += expression_part_category
        
        table.update_item(
            Key={
                'user': user
            },
            UpdateExpression=expression_user,
            ExpressionAttributeNames={
                '#key': filename,
                '#c': category
            },
            ExpressionAttributeValues={
                ':inc': 1,
                ':fb': feedback
            },
        )
        
        table.update_item(
            Key={
                'user': globalStats
            },
            UpdateExpression=expression_globalStats,
            ExpressionAttributeNames={
                '#c': category
            },
            ExpressionAttributeValues={
                ':inc': 1
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
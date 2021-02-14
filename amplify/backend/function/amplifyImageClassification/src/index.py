import urllib.parse
import boto3
import os

rekognition = boto3.client('rekognition')
dynamodb = boto3.resource('dynamodb', region_name=region_name=os.getenv('REGION'))
table = dynamodb.Table(os.getenv('STORAGE_AMPLIFYLABELALLOCATION_NAME'))

def handler(event, context):
    bucket = (urllib.parse.unquote_plus(event['Records'][0]['s3']['bucket']['name'], encoding='utf-8'))
    image = (urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8'))
    print(bucket)
    print(image)
    
    classification = rekognition.detect_labels(Image={'S3Object':{'Bucket':bucket,'Name':image}}, MaxLabels=10, MinConfidence=60)
    print(classification)
    detected_categorie = 'Undefined'
    
    for label in classification['Labels']:
        name = label['Name']
        try:
            response = table.get_item(
                Key={
                    'label': name
                })
            detected_categorie = (response['Item']['categorie'])
            break
        except:
            print(name+' -> undefined label')
    
    print(detected_categorie)
    return detected_categorie
import boto3
import os

dynamodb = boto3.resource('dynamodb', region_name=os.getenv('REGION'))
table = dynamodb.Table(os.getenv('STORAGE_AMPLIFYLABELALLOCATION_NAME'))

def handler(event, context):
    table.put_item(
        Item={
            'label': 'Landscape',
            'categorie': 'Landscape'
        }
    )
    table.put_item(
        Item={
            'label': 'Human',
            'categorie': 'Human'
        }
    )
    table.put_item(
        Item={
            'label': 'Animal',
            'categorie': 'Animal'
        }
    )
    table.put_item(
        Item={
            'label': 'Car',
            'categorie': 'Car'
        }
    )
    table.put_item(
        Item={
            'label': 'Person',
            'categorie': 'Human'
        }
    )
    print('Writing items into database succeeded:')
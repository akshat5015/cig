import boto3
import os

from dotenv import load_dotenv

load_dotenv()

rekognition = boto3.client(
    "rekognition",
    aws_access_key_id=os.getenv(
        "AWS_ACCESS_KEY_ID"
    ),
    aws_secret_access_key=os.getenv(
        "AWS_SECRET_ACCESS_KEY"
    ),
    region_name=os.getenv(
        "AWS_REGION"
    )
)

BUCKET_NAME = os.getenv(
    "AWS_BUCKET_NAME"
)


def detect_labels(image_name):

    response = rekognition.detect_labels(
        Image={
            "S3Object": {
                "Bucket": BUCKET_NAME,
                "Name": image_name
            }
        },
        MaxLabels=10,
        MinConfidence=70
    )

    labels = []

    for label in response["Labels"]:

        labels.append(label["Name"])

    return labels
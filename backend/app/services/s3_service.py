import boto3
import os
import mimetypes

from dotenv import load_dotenv

load_dotenv()

# =========================
# AWS S3 CLIENT
# =========================
s3 = boto3.client(
    "s3",
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

# =========================
# BUCKET NAME
# =========================
BUCKET_NAME = os.getenv(
    "AWS_BUCKET_NAME"
)

# =========================
# UPLOAD FILE TO S3
# =========================
def upload_file_to_s3(file, filename):

    # auto detect file type
    content_type = mimetypes.guess_type(
        filename
    )[0]

    # fallback
    if content_type is None:
        content_type = "application/octet-stream"

    # upload file
    s3.upload_fileobj(
        file,
        BUCKET_NAME,
        filename,
        ExtraArgs={
            "ContentType": content_type
        }
    )

    # generate file URL
    file_url = (
        f"https://{BUCKET_NAME}.s3."
        f"{os.getenv('AWS_REGION')}.amazonaws.com/"
        f"{filename}"
    )

    return file_url
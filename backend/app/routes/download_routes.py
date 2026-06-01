import os
import requests

from fastapi import (
    APIRouter,
    HTTPException
)

from fastapi.responses import FileResponse

from app.models.media import Media
from app.database import SessionLocal

from app.services.watermark_service import (
    add_watermark
)

router = APIRouter()

TEMP_DIR = "temp"

os.makedirs(TEMP_DIR, exist_ok=True)


@router.get("/download/{media_id}")
def download_media(
    media_id: int
):

    db = SessionLocal()

    media = db.query(Media).filter(
        Media.id == media_id
    ).first()

    if not media:
        raise HTTPException(
            status_code=404,
            detail="Media not found"
        )

    image_url = media.file_url

    image_name = image_url.split("/")[-1]

    original_path = f"{TEMP_DIR}/original_{image_name}"

    watermarked_path = (
        f"{TEMP_DIR}/watermarked_{image_name}"
    )

    # Handle S3 URLs
    if image_url.startswith("http"):

        response = requests.get(image_url)

        with open(original_path, "wb") as f:

            f.write(response.content)

    # Handle local uploads
    else:

        with open(image_url, "rb") as source:

            with open(original_path, "wb") as destination:

                destination.write(source.read())

    # Add watermark
    add_watermark(
        original_path,
        watermarked_path
    )

    return FileResponse(
        watermarked_path,
        media_type="image/jpeg",
        filename=image_name
    )
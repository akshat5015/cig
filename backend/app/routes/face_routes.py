import os
import requests

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.media import Media

from app.services.face_service import (
    verify_faces
)

router = APIRouter()

TEMP_DIR = "temp"

os.makedirs(TEMP_DIR, exist_ok=True)


@router.post("/find-my-photos")
def find_my_photos(
    selfie: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # Save uploaded selfie temporarily
    selfie_path = f"{TEMP_DIR}/{selfie.filename}"

    with open(selfie_path, "wb") as f:

        f.write(selfie.file.read())

    matched_media = []

    # Get all uploaded media
    media_files = db.query(Media).all()

    for media in media_files:

        image_url = media.file_url

        # Skip invalid URLs
        if not image_url.startswith("http"):
            continue

        try:

            image_name = image_url.split("/")[-1]

            image_path = f"{TEMP_DIR}/{image_name}"

            # Download image temporarily
            response = requests.get(image_url)

            if response.status_code != 200:
                continue

            with open(image_path, "wb") as f:

                f.write(response.content)

            # Verify faces
            matched = verify_faces(
                selfie_path,
                image_path
            )

            # Delete temporary downloaded image
            os.remove(image_path)

            # Store matched media
            if matched:

                matched_media.append({
                    "media_id": media.id,
                    "file_url": media.file_url
                })

        except Exception:
            continue

    # Delete uploaded selfie after processing
    os.remove(selfie_path)

    return {
        "matches_found": len(matched_media),
        "matches": matched_media
    }
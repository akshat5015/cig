from fastapi import (
    APIRouter,
    UploadFile,
    File,
    
    Depends
)

from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from fastapi import Query
from app.services.s3_service import (
    upload_file_to_s3
)
from app.models.tag import Tag

from app.services.rekognition_service import (
    detect_labels
)
from app.models.media import Media
from app.models.user import User

from app.utils.auth import get_current_user
from app.utils.roles import require_role

router = APIRouter()


@router.post("/upload/{event_id}")
def upload_media(
    event_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Role-based access check
    require_role(
        ["admin", "photographer"]
    )(current_user)

    # Upload file to AWS S3
    file_url = upload_file_to_s3(
        file.file,
        file.filename
    )

    # Save media info in database
    new_media = Media(
        file_name=file.filename,
        file_url=file_url,
        uploaded_by=current_user.id,
        event_id=event_id
    )

    db.add(new_media)

    db.commit()

    db.refresh(new_media)
    labels = detect_labels(file.filename)

    for label in labels:

        new_tag = Tag(
            name=label,
            media_id=new_media.id
        )

        db.add(new_tag)

    db.commit()

    return {
        "message": "File uploaded successfully",
        "media_id": new_media.id,
        "file_url": file_url
    }


@router.get("/media")
def get_all_media(
    db: Session = Depends(get_db)
):

    media = db.query(Media).all()

    return media


@router.get("/events/{event_id}/media")
def get_event_media(
    event_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):

    skip = (page - 1) * limit

    media = db.query(Media).filter(
        Media.event_id == event_id
    ).offset(skip).limit(limit).all()

    total_media = db.query(Media).filter(
        Media.event_id == event_id
    ).count()

    return {
        "page": page,
        "limit": limit,
        "total_media": total_media,
        "media": media
    }

@router.post("/bulk-upload/{event_id}")
def bulk_upload_media(
    event_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    require_role(
        ["admin", "photographer"]
    )(current_user)

    uploaded_files = []

    for file in files:

        file_url = upload_file_to_s3(
            file.file,
            file.filename
        )

        new_media = Media(
            file_name=file.filename,
            file_url=file_url,
            uploaded_by=current_user.id,
            event_id=event_id
        )

        db.add(new_media)

        db.commit()

        db.refresh(new_media)

        labels = detect_labels(file.filename)

        for label in labels:

            new_tag = Tag(
                name=label,
                media_id=new_media.id
            )

            db.add(new_tag)

        db.commit()

        uploaded_files.append({
            "media_id": new_media.id,
            "file_url": file_url
        })

    return {
        "message": "Bulk upload successful",
        "uploaded_files": uploaded_files
    }
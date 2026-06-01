from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.tag import Tag
from app.models.media import Media
from app.models.notification import Notification
from app.models.event import Event
from app.models.user import User
from app.utils.connection_manager import (
    manager
)
from app.models.favorite import Favorite
from app.models.media import Media
from app.models.like import Like
from app.models.comment import Comment
from app.models.user import User

from app.schemas.comment_schema import (
    CommentCreate
)

from app.utils.auth import get_current_user

router = APIRouter()


@router.post("/like/{media_id}")
def like_media(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    existing_like = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.media_id == media_id
    ).first()

    if existing_like:
        return {"message": "Already liked"}

    new_like = Like(
        user_id=current_user.id,
        media_id=media_id
    )

    db.add(new_like)

    db.commit()
    media = db.query(Media).filter(
        Media.id == media_id
    ).first()

    notification = Notification(
        message=f"{current_user.username} liked your photo",
        user_id=media.uploaded_by
    )

    db.add(notification)

    db.commit()
    return {"message": "Media liked successfully"}


@router.post("/comment/{media_id}")
def comment_media(
    media_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_comment = Comment(
        text=comment.text,
        user_id=current_user.id,
        media_id=media_id
    )

    db.add(new_comment)

    db.commit()
    media = db.query(Media).filter(
        Media.id == media_id
    ).first()

    notification = Notification(
        message=f"{current_user.username} commented on your photo",
        user_id=media.uploaded_by
    )

    db.add(notification)

    db.commit()

    return {"message": "Comment added successfully"}


@router.get("/media/{media_id}/likes")
def get_likes(
    media_id: int,
    db: Session = Depends(get_db)
):

    likes = db.query(Like).filter(
        Like.media_id == media_id
    ).count()

    return {"likes": likes}


@router.get("/media/{media_id}/comments")
def get_comments(
    media_id: int,
    db: Session = Depends(get_db)
):

    comments = db.query(Comment).filter(
        Comment.media_id == media_id
    ).all()

    return comments
    
@router.get("/search")
def advanced_search(
    query: str,
    db: Session = Depends(get_db)
):

    # Search by tags
    matching_tags = db.query(Tag).filter(
        Tag.name.ilike(f"%{query}%")
    ).all()

    tag_media_ids = []

    for tag in matching_tags:

        tag_media_ids.append(tag.media_id)

    # Search by event title
    matching_events = db.query(Event).filter(
        Event.title.ilike(f"%{query}%")
    ).all()

    event_ids = []

    for event in matching_events:

        event_ids.append(event.id)

    event_media = db.query(Media).filter(
        Media.event_id.in_(event_ids)
    ).all()

    # Search by uploader username
    matching_users = db.query(User).filter(
        User.username.ilike(f"%{query}%")
    ).all()

    user_ids = []

    for user in matching_users:

        user_ids.append(user.id)

    user_media = db.query(Media).filter(
        Media.uploaded_by.in_(user_ids)
    ).all()

    # Search by media IDs from tags
    tag_media = db.query(Media).filter(
        Media.id.in_(tag_media_ids)
    ).all()

    # Combine results
    all_media = (
        tag_media +
        event_media +
        user_media
    )

    # Remove duplicates
    unique_media = []

    seen_ids = set()

    for media in all_media:

        if media.id not in seen_ids:

            unique_media.append(media)

            seen_ids.add(media.id)

    return unique_media

@router.delete("/like/{media_id}")
def unlike_media(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    existing_like = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.media_id == media_id
    ).first()

    if not existing_like:
        return {"message": "Like does not exist"}

    db.delete(existing_like)

    db.commit()

    return {"message": "Media unliked successfully"}

@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    comment = db.query(Comment).filter(
        Comment.id == comment_id
    ).first()

    if not comment:
        return {"message": "Comment not found"}

    if comment.user_id != current_user.id:
        return {"message": "Not authorized"}

    db.delete(comment)

    db.commit()

    return {"message": "Comment deleted successfully"}


@router.post("/favorite/{media_id}")
def add_to_favorites(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    existing_favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.media_id == media_id
    ).first()

    if existing_favorite:

        return {
            "message": "Already in favorites"
        }

    new_favorite = Favorite(
        user_id=current_user.id,
        media_id=media_id
    )

    db.add(new_favorite)

    db.commit()

    return {
        "message": "Added to favorites"
    }


@router.delete("/favorite/{media_id}")
def remove_from_favorites(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.media_id == media_id
    ).first()

    if not favorite:

        return {
            "message": "Favorite not found"
        }

    db.delete(favorite)

    db.commit()

    return {
        "message": "Removed from favorites"
    }

@router.get("/my-favorites")
def get_my_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    favorites = db.query(Favorite).filter(
        Favorite.user_id == current_user.id
    ).all()

    media_ids = []

    for favorite in favorites:

        media_ids.append(favorite.media_id)

    media = db.query(Media).filter(
        Media.id.in_(media_ids)
    ).all()

    return media
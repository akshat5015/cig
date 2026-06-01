from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db

from app.models.event import Event
from app.utils.roles import require_role
from app.models.user import User

from app.schemas.event_schema import EventCreate

from app.utils.auth import (
    get_current_user,
    get_optional_user
)

router = APIRouter()

@router.post("/events")
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    require_role(
        ["admin", "club_member", "photographer"]
    )(current_user)

    new_event = Event(
        
        title=event.title,
        description=event.description,
        category=event.category,
        is_private=event.is_private,
        created_by=current_user.id
    )

    db.add(new_event)

    db.commit()

    db.refresh(new_event)

    return {
        "message": "Event created successfully",
        "event_id": new_event.id
    }


@router.get("/events")
def get_events(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):

    if current_user and current_user.role in [
        "admin",
        "club_member",
        "photographer"
    ]:

        events = db.query(Event).all()

    else:

        events = db.query(Event).filter(
            Event.is_private == False
        ).all()

    return events
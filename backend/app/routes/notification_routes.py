from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    Depends
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.notification import (
    Notification
)

from app.models.user import User

from app.utils.auth import get_current_user

from app.utils.connection_manager import (
    manager
)

router = APIRouter()


@router.websocket("/ws/notifications")
async def websocket_notifications(
    websocket: WebSocket
):

    await manager.connect(websocket)

    try:

        while True:

            await websocket.receive_text()

    except WebSocketDisconnect:

        manager.disconnect(websocket)


@router.get("/notifications")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).all()

    return notifications
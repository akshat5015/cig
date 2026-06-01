from fastapi import FastAPI
from sqlalchemy import text
from fastapi.staticfiles import StaticFiles
from app.models.event import Event
from app.routes.notification_routes import (
    router as notification_router
)
from fastapi.middleware.cors import CORSMiddleware
from app.models.media import Media
from app.models.like import Like
from app.models.notification import Notification
from app.models.tag import Tag
from app.models.comment import Comment
from app.database import engine, Base
from app.routes.download_routes import (
    router as download_router
)
from app.models.favorite import Favorite
from app.models.user import User
from app.routes.face_routes import (
    router as face_router
)
from app.routes.event_routes import (
    router as event_router
)
from app.routes.social_routes import (
    router as social_router
)
from app.routes.media_routes import (
    router as media_router
)
from app.routes.user_routes import router as user_router

app = FastAPI()
import os

os.makedirs("uploads", exist_ok=True)
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)
app.include_router(face_router)
app.include_router(user_router)
app.include_router(notification_router)
app.include_router(social_router)
app.include_router(media_router)
app.include_router(event_router)
app.include_router(download_router)

@app.get("/")
def root():
    return {"message": "EventSphere Backend Running"}


@app.get("/test-db")
def test_db():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {"message": "Database connected successfully"}

    except Exception as e:
        return {"error": str(e)}
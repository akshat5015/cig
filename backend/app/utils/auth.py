from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

from app.database import get_db
from app.models.user import User

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = os.getenv("ALGORITHM")


# IMPORTANT:
# auto_error=False allows public access
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login",
    auto_error=False
)


# =========================
# REQUIRED AUTH
# =========================
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials"
    )

    # token missing
    if token is None:
        raise credentials_exception

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user is None:
        raise credentials_exception

    return user


# =========================
# OPTIONAL AUTH
# =========================
def get_optional_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    # no token provided
    if token is None:
        return None

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if user_id is None:
            return None

    except JWTError:
        return None

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    return user
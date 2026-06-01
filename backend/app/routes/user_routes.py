from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.utils.auth import get_current_user
from app.database import get_db
from app.models.user import User

from app.schemas.user_schema import (
    UserCreate,
    UserLogin
)

from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter()


# =========================
# SIGNUP ROUTE
# =========================
@router.post("/signup")
def signup(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    # hash password
    hashed_pw = hash_password(user.password)

    # create user object
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw
    )

    # save to db
    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user_id": new_user.id
    }


# =========================
# LOGIN ROUTE
# =========================
@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    # check email exists
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    # invalid email
    if not existing_user:
        return {
            "error": "Invalid email"
        }

    # verify password
    valid_password = verify_password(
        user.password,
        existing_user.hashed_password
    )

    # invalid password
    if not valid_password:
        return {
            "error": "Invalid password"
        }

    # create jwt token
    access_token = create_access_token(
        data={
            "user_id": existing_user.id,
            "email": existing_user.email
        }
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }

# aaa
@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role
    }
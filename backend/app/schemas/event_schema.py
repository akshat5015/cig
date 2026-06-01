from pydantic import BaseModel


class EventCreate(BaseModel):

    title: str

    description: str

    category: str

    is_private: bool = False
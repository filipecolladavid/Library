from typing import List, Optional
from pydantic import BaseModel


class Author(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class Genre(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class Idiom(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
    
class Location(BaseModel):
    id: int
    name: str

    class Config: 
        orm_mode = True


class BookBase(BaseModel):
    name: str
    isbn: Optional[str] = None
    author: List[str]
    genre: List[str]
    desc: str
    idiom: str
    location: str


class Book(BookBase):
    id: int
    author: List[Author]
    genre: List[Genre]
    idiom: Idiom
    location: Location
    imgPath: str

    class Config:
        orm_mode = True


class AtrOut(Book):
    books: List[Book]

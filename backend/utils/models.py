from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

book_author = Table(
    "book_author",
    Base.metadata,
    Column("book_id", ForeignKey("books.id")),
    Column("author_id", ForeignKey("authors.id")),
)

book_genre = Table(
    "book_genre",
    Base.metadata,
    Column("book_id", ForeignKey("books.id")),
    Column("genre_id", ForeignKey("genres.id"))
)


class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True)
    isbn = Column(String, unique=True, nullable=True)
    name = Column(String(255))
    author = relationship(
        "Author",
        secondary=book_author,
        backref="books"
    )
    genre = relationship(
        "Genre",
        secondary=book_genre,
        backref="books"
    )
    # Add function to decode isbn - future
    # isbn = relationship("ISBN", back_populates="books")
    desc = Column(String(1024))
    idiom_id = Column(Integer, ForeignKey("idioms.id"))
    idiom = relationship(
        "Idiom",
        backref="books"
    )
    location_id = Column(Integer, ForeignKey("locations.id"))
    location = relationship(
        "Location",
        backref="books"
    )
    imgPath = Column(String(255))


class Location(Base):
    __tablename__ = "locations"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    book = relationship("Book", back_populates="location", overlaps="books")


class Idiom(Base):
    __tablename__ = "idioms"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    book = relationship("Book", back_populates="idiom", overlaps="books")


class Author(Base):
    __tablename__ = "authors"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))


class Genre(Base):
    __tablename__ = "genres"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))

# class ISBN(Base):
#     __tablename__= "isbn"
#     id = Column(Integer, primary_key=True, unique=True, nullable=True)
#     prefix = Column(Integer)
#     group = Column(Integer)
#     publisher = Column(Integer)
#     title = Column(Integer)

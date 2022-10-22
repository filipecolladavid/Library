from unicodedata import name
from sqlalchemy.orm import Session
from . import models, schemas


def get_book_id(db: Session, book_id: int):
    return db.query(models.Book).filter(models.Book.id == book_id).first()


def get_book_isbn(db: Session, isbn: str):
    if isbn == "":
        return None
    else:
        return db.query(models.Book).filter(models.Book.isbn == isbn).first()


def get_book_name(db: Session, book_name: str):
    return db.query(models.Book).filter(models.Book.name == book_name).first()


def get_book_all(db: Session, skip: int, limit: int):
    db.query(models.Author).offset
    return db.query(models.Book).offset(skip).limit(limit).all()


def get_all_authors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Author).offset(skip).limit(limit).all()


def get_all_genres(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Genre).offset(skip).limit(limit).all()


def get_all_idioms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Idiom).offset(skip).limit(limit).all()


def get_all_locations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Location).offset(skip).limit(limit).all()


def get_books_by_query(db: Session, skip: int, limit: int, author_id: int, genre_id: int, idiom_id: int, location_id: int, query: str):

    if (author_id == -1 and genre_id == -1 and idiom_id == -1 and location_id == -1 and query == ""):
        return get_book_all(db=db, skip=skip, limit=limit)

    if (author_id != -1 and genre_id == -1 and idiom_id == -1 and location_id == -1 and query == ""):
        db_author = db.query(models.Author).filter_by(id=author_id).first()
        if db_author:
            return db_author.books
        else:
            return []

    if (genre_id != -1 and author_id == -1 and idiom_id == -1 and location_id == -1 and query == ""):
        db_genre = db.query(models.Genre).filter_by(id=genre_id).first()
        if db_genre:
            return db_genre.books
        else:
            return []

    if (idiom_id != -1 and author_id == -1 and location_id == -1 and genre_id == -1 and query == ""):
        db_idiom = db.query(models.Idiom).filter_by(id=idiom_id).first()
        if db_idiom:
            return db_idiom.books
        else:
            return []

    if (location_id != -1 and author_id == -1 and genre_id == -1 and idiom_id == -1 and query == ""):
        db_loc = db.query(models.Location).filter_by(id=location_id).first()
        if db_loc:
            return db_loc.books
        else:
            return []

    if (query != "" and author_id == -1 and genre_id == -1 and location_id == -1 and idiom_id == -1):
        db_query = db.query(models.Book).filter(
            models.Book.name.like("%"+query+"%")).all()
        print(db_query)
        if db_query:
            return db_query
        else:
            return []
    else:
        return None


def create_book(db: Session, book: schemas.BookBase):

    db_idiom = db.query(models.Idiom).filter(
        models.Idiom.name == book.idiom).first()
    if not db_idiom:
        db_idiom = models.Idiom(name=book.idiom)

    db_loc = db.query(models.Location).filter(
        models.Location.name == book.location).first()
    if not db_loc:
        db_loc = models.Location(name=book.location)

    db_book = models.Book(
        name=book.name,
        author=[],
        genre=[],
        idiom=db_idiom,
        desc=book.desc,
        location=db_loc,
        imgPath="",
    )

    if book.isbn != "":
        if db_book.isbn:
            db_book.isbn = book.isbn  # type: ignore

    for author in book.author:
        db_author = db.query(models.Author).filter(
            models.Author.name == author).first()
        if not db_author:
            db_author = models.Author(name=author)
        db_book.author.append(db_author)

    for genre in book.genre:
        db_genre = db.query(models.Genre).filter(
            models.Genre.name == genre).first()
        if not db_genre:
            db_genre = models.Genre(name=genre)
        db_book.genre.append(db_genre)

    db.add(db_book)
    db.commit()

    db.refresh(db_book)

    return db_book


def append_img(db: Session, book_id: int):
    return ""


def delete_book(db: Session, book_id: int):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()

    for author in book.author:
        db_author = db.query(models.Author).filter_by(id=author.id).first()
        if len(db_author.books) == 1:
            db.delete(db_author)

    for genre in book.genre:
        db_genre = db.query(models.Genre).filter_by(id=genre.id).first()
        if len(db_genre.books) == 1:
            db.delete(db_genre)

    db_idiom = db.query(models.Idiom).filter_by(id=book.idiom.id).first()
    if len(db_idiom.books) == 1:
        db.delete(db_idiom)

    db_loc = db.query(models.Location).filter_by(id=book.location.id).first()
    if len(db_loc.books) == 1:
        db.delete(db_loc)

    db.delete(book)
    db.commit()
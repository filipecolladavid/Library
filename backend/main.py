from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from utils import crud, models, schemas
from utils.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(CORSMiddleware,
                   allow_origins=['*'],
                   allow_credentials=True,
                   allow_methods=['*'],
                   allow_headers=['*'])

# Dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# isbn = "" -> doesn't have
@app.post("/book/manual", response_model=schemas.Book)
def create_book(book: schemas.BookBase, db: Session = Depends(get_db)):
    
    db_book_isbn = crud.get_book_isbn(db=db, isbn=book.isbn)  # type: ignore
    db_book_name = crud.get_book_name(db=db, book_name=book.name)
    if db_book_isbn or db_book_name:
        raise HTTPException(status_code = 400, detail = "Book already registered")
    db_book = crud.create_book(db=db, book=book)
    return db_book

@app.post("/book/mult", response_model=List[schemas.Book])
def create_books(books: List[schemas.BookBase], db: Session = Depends(get_db)):
    booksResult = []
    for book in books:
        db_book_isbn = crud.get_book_isbn(db=db, isbn=book.isbn)  # type: ignore
        db_book_name = crud.get_book_name(db=db, book_name=book.name)
        if db_book_isbn or db_book_name:
            raise HTTPException(status_code = 400, detail = "Book already registered")
        db_book = crud.create_book(db=db, book=book)
        booksResult.append(db_book)
    return booksResult


@app.post("/book/isbn", response_model=schemas.Book)
def create_book_isbn(isbn: int, db: Session = Depends(get_db)):
    # TODO - fetch from isbn database, fill new book with fetched data
    return []


@app.get("/book/", response_model=List[schemas.Book])
def get_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_book_all(db=db, skip=skip, limit=limit)

@app.get("/book/id", response_model = schemas.Book)
def get_book_by_id(id: int, db: Session = Depends(get_db)):
    db_book = crud.get_book_id(db=db, book_id=id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book

@app.get("/book/authors", response_model=List[schemas.Author])
def get_all_authors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_authors(db=db, skip=skip, limit=limit)


@app.get("/book/genres", response_model=List[schemas.Genre])
def get_all_genres(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_genres(db=db, skip=skip, limit=limit)


@app.get("/book/idioms", response_model=List[schemas.Idiom])
def get_all_idioms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_idioms(db=db, skip=skip, limit=limit)

@app.get("/books/locations", response_model=List[schemas.Location])
def get_all_locations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_locations(db=db, skip=skip, limit=limit)


# Only one at a time, if all empthy return all books
@app.get("/book/query", response_model=List[schemas.Book])
def get_book_by_query(skip: int = 0, limit: int = 100, author_id: int = -1, genre_id: int = -1, idiom_id: int = -1, location_id: int = -1, query: str = "", db: Session = Depends(get_db)):
    result =  crud.get_books_by_query(db=db, skip=skip, limit=limit, author_id=author_id, genre_id=genre_id, idiom_id=idiom_id, location_id=location_id, query=query)
    if result is None:
        raise HTTPException(status_code=400, detail = "Invalid Request, one at a time")
    else:
        return result

@app.post("/book/delete", response_model=str)
def delete_book_by_id(id: int, db: Session = Depends(get_db)):
    db_book = crud.get_book_id(db=db, book_id=id)
    if db_book:
        name = db_book.name
        crud.delete_book(db=db, book_id=id)
        return name
    else: 
        raise HTTPException(status_code=404, detail = "Can't find that book")
    
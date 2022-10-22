import { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5"

import FormModalAddBook from "./FormModalAddBook";

const ModalAddBook = ({ show, handleClose }) => {

  const [dbAuthor, setDbAuthor] = useState([]);
  const [dbGenre, setDbGenre] = useState([]);
  const [dbIdiom, setDbIdiom] = useState([]);
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null);
  const [submited, setSubmited] = useState(false);
  const [bookName, setBookName] = useState("");

  useEffect(() => {
    setLoading(true)
    async function getAuthors() {
      await fetch("http://0.0.0.0:8000/book/authors").then((response) => {
        // first then()
        if (!response.ok) {
          throw Error(response.status);
        }
        else {
          return response.json();
        }
      }).then((data) => {
        setDbAuthor(data);
        console.log(data);
      }).catch((err) => {
        console.log(err);
        setErrorMessage("Algo correu mal | " + err);
      })
    }
    async function getGenres() {
      await fetch("http://0.0.0.0:8000/book/genres").then((response) => {
        // first then()
        if (!response.ok) {
          throw Error(response.status);
        }
        else {
          return response.json();
        }
      }).then((data) => {
        setDbGenre(data);
        console.log(data);
      }).catch((err) => {
        console.log(err);
        setErrorMessage("Algo correu mal | " + err);
      })
    }
    async function getIdiom() {
      await fetch("http://0.0.0.0:8000/book/idioms").then((response) => {
        // first then()
        if (!response.ok) {
          throw Error(response.status);
        }
        else {
          return response.json();
        }
      }).then((data) => {
        setDbIdiom(data);
        console.log(data);
      }).catch((err) => {
        console.log(err);
        setErrorMessage("Algo correu mal | " + err);
      })
    }
    getAuthors();
    getGenres();
    getIdiom();
    setLoading(false)
  }, [setLoading, setErrorMessage, ])

  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Adicionar um livro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          loading ?
            <div className="statusContainer">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
            :
            submited ?
              !errorMessage ?
                <div className="statusContainer">
                  <IoCheckmarkCircle color="green" size={50} />
                  {bookName} Adicionado com sucesso!
                </div>
                :
                <div className="statusContainer">
                  <IoCloseCircle color="red" size={50} />
                  Algo correu mal : {errorMessage}
                </div>
              :
              <FormModalAddBook
                setLoading={setLoading}
                setErrorMessage={setErrorMessage}
                setSubmited={setSubmited}
                setBookName={setBookName}
                dbAuthor={dbAuthor}
                dbGenre={dbGenre}
                dbIdiom={dbIdiom}
              />
        }
      </Modal.Body>
      <Modal.Footer>
        {!submited && !loading ?
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          :
          <></>
        }
        {!loading &&
          submited &&
          <Button variant="primary" onClick={handleClose}>
            Ok
          </Button>
        }

      </Modal.Footer>
    </Modal >
  );
}

export default ModalAddBook;
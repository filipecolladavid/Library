import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

import { IoCloseCircle } from "react-icons/io5";

import { Container, Spinner, Row, Col } from "react-bootstrap";

import Result from "./Result";
import Query from "./Query";
import ModalAddBook from "./ModalAddBook";
import ModalRemoveBook from "./ModaRemoveBook";

import { useEffect, useState } from "react";

function App() {
  const [animationClass, setAnimationClass] = useState(["icon", "solo"]);
  // Saves the id of the book selected
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submited, setSubmited] = useState(false);
  const [response, setResponse] = useState(null);

  const [valid, setValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);

  const [modalLoading, setModalLoading] = useState(true);
  const [queryTip, setQueryTip] = useState("");
  const [authors, setAuthors] = useState(null);
  const [genres, setGenres] = useState(null);
  const [idioms, setIdioms] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const handleClose = () => {
    setShow(false);
    setRefresh(true);
    getAll();
  };
  const handleShow = () => {
    setShow(true);
    setRefresh(false);
    setModalLoading(true);
    async function getAuthors() {
      await fetch("http://0.0.0.0:8000/book/authors")
        .then((response) => {
          // first then()
          if (!response.ok) {
            throw Error(response.status);
          } else {
            return response.json();
          }
        })
        .then((data) => {
          setAuthors(data);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage("Algo correu mal | " + err);
        });
    }
    async function getGenres() {
      await fetch("http://0.0.0.0:8000/book/genres")
        .then((response) => {
          // first then()
          if (!response.ok) {
            throw Error(response.status);
          } else {
            return response.json();
          }
        })
        .then((data) => {
          setGenres(data);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage("Algo correu mal | " + err);
        });
    }
    async function getIdiom() {
      await fetch("http://0.0.0.0:8000/book/idioms")
        .then((response) => {
          // first then()
          if (!response.ok) {
            throw Error(response.status);
          } else {
            return response.json();
          }
        })
        .then((data) => {
          setIdioms(data);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage("Algo correu mal | " + err);
        });
    }
    getAuthors();
    getGenres();
    getIdiom();
    console.log(authors);
    console.log(idioms);
    console.log(genres);
    setModalLoading(false);
  };

  async function getAll() {
    await fetch("http://0.0.0.0:8000/book/")
      .then((response) => {
        if (!response.ok) {
          throw Error(response.status);
        } else return response.json();
      })
      .then((data) => {
        setResponse(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("Algo correu mal | " + err);
      });
  }

  const handleShowDelete = () => {
    setShowDelete(true);
    setRefresh(false);
  };

  const handleCloseDelete = () => {
    setSelectedInfo(null);
    setShowDelete(false);
    getAll();
    setRefresh(true);
  };

  useEffect(() => {
    setAnimationClass(
      selectedInfo || selectedInfo === 0
        ? ["icons all", "mult"]
        : ["icons", "solo"]
    );
  }, [setSelectedInfo, selectedInfo, showDelete]);

  return (
    <div className="App">
      <header>
        <Row>
          <Col className="title">Library</Col>
          <Col>
            <Query
              setLoading={setLoading}
              setSubmited={setSubmited}
              setValid={setValid}
              setResponse={setResponse}
              setQueryTip={setQueryTip}
              refresh={refresh}
            />
          </Col>
        </Row>
      </header>
      <div className="bottomContainer">
        <div className={animationClass[0]}>
          <div className={animationClass[1]} id="first">
            <IoIosAddCircleOutline onClick={handleShow} />
            Adicionar um Livro
          </div>
          <div className={animationClass[1]} id="third">
            <>
              <IoIosCloseCircleOutline onClick={() => handleShowDelete()} />
              Remover Livro
            </>
          </div>
          {/* <div className={animationClass[1]} id="third">
            <IoMdCreate onClick={() => console.log("Edit" + selectedInfo)} />
            Editar Livro
          </div> */}
        </div>
        <Container className="result">
          {submited &&
            (loading ? (
              <div className="statusContainer">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : !valid ? (
              <div className="statusContainer">
                <IoCloseCircle color="red" size={50} />
                Algo correu mal : {errorMessage}
              </div>
            ) : (
              <Result
                response={response}
                selectedInfo={selectedInfo}
                setSelectedInfo={setSelectedInfo}
                queryTip={queryTip}
              />
            ))}
        </Container>
        {show && (
          <ModalAddBook
            show={show}
            handleClose={handleClose}
            loading={modalLoading}
            setLoading={setModalLoading}
            db_authors={authors}
            db_gneres={genres}
            db_idioms={idioms}
          />
        )}
        {showDelete && (
          <ModalRemoveBook
            showDelete={showDelete}
            handleCloseDelete={handleCloseDelete}
            selectedInfo={selectedInfo}
            setResponse={setResponse}
          />
        )}
      </div>
    </div>
  );
}

export default App;

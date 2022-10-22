import { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { IoCloseCircle, IoCheckmarkCircle } from "react-icons/io5";

const ModalRemoveBook = ({ showDelete, handleCloseDelete, selectedInfo, setResponse }) => {

  const [loading, setLoading] = useState(true);
  const [bookName, setBookName] = useState(null);
  const [submited, setSubmited] = useState(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    async function getBook() {
      await fetch("http://0.0.0.0:8000/book/id?id=" + selectedInfo)
        .then((response) => {
          if (!response.ok) {
            throw Error("Algo correu mal: " + response.status);
          }
          else return response.json();
        })
        .then((data) => {
          setBookName(data.name);
        })
        .catch((err) => {
          console.log(err);
          setBookName(null);
        })
      setLoading(false);
    }
    if (!selectedInfo) setBookName(null);
    else getBook();
  }, [setBookName, selectedInfo])



  async function handleDelete() {
    setSubmited(true);
    await fetch("http://0.0.0.0:8000/book/delete?id=" + selectedInfo,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          mode: "Access-Control-Allow-Origin",
        },
      }
    )
      .then((response) => {
        if (!response.ok) throw Error("Algo correu mal: " + response.status);
        else return response.json();
      })
      .then((data) => {
        setBookName(data);
        setValid(true);
      })
      .catch((err) => {
        setValid(false);
        console.log(err)
      })
  }

  return (
    <Modal show={showDelete} onHide={handleCloseDelete}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ?
          <div className="statusContainer">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
          :
          submited ?
            valid ?
              <div className="statusContainer">
                <IoCheckmarkCircle color="green" size={50} />
                {bookName} removido com sucesso!
              </div>
              :
              <div className="statusContainer">
                <IoCloseCircle color="red" size={50} />
                Algo correu mal
              </div>
            :
            bookName ?
              <>Vai eliminar {bookName}</>
              :
              <div className="statusContainer">
                <IoCloseCircle color="red" size={50} />
                O livro que escolheu não é válido
              </div>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseDelete}>
          Fechar
        </Button>
        {bookName && !submited &&
          <Button variant="danger" onClick={handleDelete}>
            Apagar
          </Button>
        }
      </Modal.Footer>
    </Modal>
  );
}

export default ModalRemoveBook;
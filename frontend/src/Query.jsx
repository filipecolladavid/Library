import { useEffect, useState } from "react";
import { Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { IoSearch } from "react-icons/io5"

const Query = ({ setLoading, setSubmited, setValid, setResponse, setQueryTip, refresh }) => {

  const [author, setAuthor] = useState([]);
  const [genre, setGenre] = useState([]);
  const [idiom, setIdiom] = useState([]);
  const [location, setLocation] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null)
  const [queryLoading, setQueryLoading] = useState(true);

  useEffect(() => {
    setQueryLoading(true)
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
        setAuthor(data);
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
        setGenre(data);
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
        setIdiom(data);
        console.log(data);
      }).catch((err) => {
        console.log(err);
        setErrorMessage("Algo correu mal | " + err);
      })
    }
    getAuthors();
    getGenres();
    getIdiom();
    setQueryLoading(false)
  }, [setQueryLoading, setResponse, refresh])

  //Do query seperatly

  const [formData, setFormData] = useState({
    author: "",
    genre: "",
    idiom: "",
    query: ""
  })

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmited(true);
    setLoading(true);

    if (formData.query === "") {
      await fetch("http://0.0.0.0:8000/book/")
        .then((response) => {
          if (!response.ok) {
            throw Error(response.status);
          }
          else return response.json();
        })
        .then((data)=> {
          setResponse(data);
          setQueryTip(formData.query);
          console.log(data);
        })
        .catch((err)=> {
          console.log(err);
          setErrorMessage("Algo correu mal | " + err)
        })
    }
    else {

      await fetch("http://0.0.0.0:8000/book/query?query=" + formData.query)
        .then((response) => {
          // first then()
          if (!response.ok) {
            throw Error(response.status);
          }
          else {
            return response.json();
          }
        }).then((data) => {
          setResponse(data)
          setQueryTip(formData.query);
          console.log(data);
        }).catch((err) => {
          console.log(err);
          setErrorMessage("Algo correu mal | " + err);
        })
      console.log(
        "author: " + formData.author + "\n" +
        "genre: " + formData.genre + "\n" +
        "idiom: " + formData.idiom + "\n" +
        "query: " + formData.query + "\n"
      );
    }
    setLoading(false);
    setValid(true)
  }

  async function handleSingleSubmit(e, id) {
    let type = [["author_id", "autor"], ["genre_id", "género"], ["idiom_id", "idioma"], ["location_id", "localização"]];

    await fetch("http://0.0.0.0:8000/book/query?" + type[id][0] + "=" + e.target.value).then((response) => {
      // first then()
      if (!response.ok) {
        throw Error(response.status);
      }
      else {
        return response.json();
      }
    }).then((data) => {
      let selectedIndex = e.target.options.selectedIndex;
      setResponse(data);
      setQueryTip(type[id][1] + ": " + e.target.options[selectedIndex].getAttribute("label"))
      console.log(data);
    }).catch((err) => {
      console.log(err);
      setErrorMessage("Algo correu mal | " + err);
    })
    setFormData({ ...formData, query: "" })
    setLoading(false);
    setQueryLoading(false);
  }

  return (

    !errorMessage ?
      queryLoading ?
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        :
        <Row className="align-items-center">
          <Col md={9}>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Form.Group className="mb-2" controlId="text">
                  <Form.Label>Pesquise por um livro</Form.Label>
                  <Form.Control
                    type="text"
                    name="query"
                    placeholder="Livro..."
                    value={formData.query}
                    onChange={(e) => setFormData({ ...formData, query: e.target.value })}>
                  </Form.Control>
                </Form.Group>
              </Row>
              <Form.Group className="mb-2" controlId="select">
                <Row>
                  <Col>
                    <Form.Label>Autor</Form.Label>
                    <Form.Select
                      onChange={(e) => {
                        if (e.target.value !== "Selecione um valor") {
                          setFormData({ ...formData, author: e.target.value })
                          handleSingleSubmit(e, 0)
                        }
                      }}>
                      <option>Selecione um valor</option>
                      {author.map((author, idx) => (<option key={author + "_" + idx} label={author.name} value={author.id}></option>))}
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Label>Género</Form.Label>
                    <Form.Select onChange={(e) => {
                      if (e.target.value !== "Selecione um valor") {
                        setFormData({ ...formData, genre: e.target.value })
                        handleSingleSubmit(e, 1)
                      }
                    }}>
                      <option>Selecione um valor</option>
                      {genre.map((genre, idx) => (<option key={genre + "_" + idx} label={genre.name} value={genre.id}></option>))}
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Label>Idioma</Form.Label>
                    <Form.Select onChange={(e) => {
                      if (e.target.value !== "Selecione um valor") {
                        setFormData({ ...formData, idiom: e.target.value });
                        handleSingleSubmit(e, 2)
                      }
                    }
                    }>
                      <option>Selecione um valor</option>
                      {idiom.map((idiom, idx) => (<option key={idiom + "_" + idx} label={idiom.name} value={idiom.id}></option>))}
                    </Form.Select>
                  </Col>
                </Row>
              </Form.Group>
            </Form >
          </Col>
          <Col md={3} className="buttonQuery" onClick={handleSubmit}>
            <IoSearch size={40} />
          </Col>
        </Row>
      :
      <Alert variant="danger">{errorMessage}</Alert>
  );
}

export default Query; 
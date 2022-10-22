import { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { IoAdd } from "react-icons/io5";
import SelectAndAdd from "./SelectAndAdd";

const FormModalAddBook = ({ setLoading, setErrorMessage, setSubmited, setBookName, dbAuthor, dbGenre, dbIdiom }) => {

  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [submitedFirst, setSubmitedFirst] = useState(false);

  const [newAuthor, setNewAuthor] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newIdiom, setNewIdiom] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    isbn: "",
    desc: "",
    idiom: "",
    location: "",
  });

  useEffect(() => {
    let newAuthors = authors;
    let newGenres = genres;
    setFormData(currValue => ({
      ...currValue,
      author: newAuthors,
      genre: newGenres
    }))
  }, [authors, genres])

  async function request(e) {
    setLoading(true);
    setSubmited(true);

    console.log(JSON.stringify(formData));

    await fetch("http://0.0.0.0:8000/book/manual",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          mode: "Access-Control-Allow-Origin",
        },
        body: JSON.stringify(formData),
      })
      .then((response) => {
        if (response.ok) {
          setSubmited(true);
          return response.json();
        } else if (response.status === 400) {
          setErrorMessage("Livro já existe, escolha outro nome");
        }
        else {
          throw new Error("Something went wrong.", response);
        }
      })
      .then((data) => {
        console.log("Request successful", data);
        setBookName(data.name);
        return data;
      })
      .catch((error) => {
        console.log("Request failed", error);
        setErrorMessage("Algo correu mal")
      });

    setLoading(false);
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log(form.checkValidity())
    if (form.checkValidity() === false ||
      formData.name === "" ||
      formData.desc === "" ||
      formData.idiom === "" ||
      formData.location === "" ||
      authors.length === 0 ||
      genres.length === 0) {
      event.preventDefault();
      event.stopPropagation();
      setSubmitedFirst(true);
    }
    else {
      event.preventDefault();
      request(event);
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Row>
        <Col sm={5}>
          <Row>
            <Form.Group className="mb-2" controlId="name">
              <Form.Label><b>Nome</b></Form.Label>
              <Form.Control
                type="text"
                autoFocus
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                isInvalid={formData.name === "" && submitedFirst}
              />
              <Form.Control.Feedback type="invalid">
                Tem que inserir um titulo.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group className="mb-2" controlId="isbn">
              <Form.Label><b>ISBN</b></Form.Label>
              <Form.Control
                type="text"
                autoFocus
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
              />
            </Form.Group>
          </Row>
        </Col>
        <Col sm={6}>
          <Form.Group className="mb-2" controlId="desc">
            <Form.Label><b>Descrição</b></Form.Label>
            <Form.Control
              as="textarea"
              required
              rows={4}
              onChange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
              }
              isInvalid={formData.desc === "" && submitedFirst}
            />
            <Form.Control.Feedback type="invalid">
              Tem que inserir uma descrição.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-2" controlId="author">
        <Row className="align-items-center">
          <Row>
            <Form.Label><b>Autores</b></Form.Label>
          </Row>
          <Col sm={5}>
            <Form.Label>Escolher existente</Form.Label>
            <Form.Select
              value="Add New element"
              onChange={(e) => {
                let array = authors;
                if (!array.includes(e.target.value) && e.target.value !== "Choose...")
                  setAuthors((author) => [...author, e.target.value])
              }}
              isInvalid={authors.length === 0 && submitedFirst}
            >
              <option>Add New element</option>
              {dbAuthor.map((author) => (<option key={author.name} value={author.name}>{author.name}</option>))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Tem que selecionar pelo menos um autor
            </Form.Control.Feedback>
          </Col>
          <Col sm={6}>
            <Form.Label>Adicione um novo</Form.Label>
            <Form.Control
              type="text"
              autoFocus
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              isInvalid={authors.length === 0 && submitedFirst}
            />
          </Col>
          <Col sm={1}>
            <IoAdd
              color="white"
              size={25}
              className="addButton"
              onClick={() => {
                let array = authors;
                if (!array.includes(newAuthor) && newAuthor !== "") {
                  setAuthors((author) => [...author, newAuthor])
                }
                setNewAuthor("");
              }}
            />
          </Col>
        </Row>
        <Row> {authors && <SelectAndAdd array={authors} setValues={setAuthors} />}</Row>
      </Form.Group>
      <Form.Group className="mb-2" controlId="genre">
        <Row>
          <Form.Label><b>Género</b></Form.Label>
        </Row>
        <Row className="align-items-center">
          <Col sm={5}>
            <Form.Label>Escolher existente</Form.Label>
            <Form.Select
              value="Add New element"
              onChange={(e) => {
                let array = genres;
                if (!array.includes(e.target.value) && e.target.value !== "Choose...")
                  setGenres((genres) => [...genres, e.target.value])
              }}
              isInvalid={genres.length === 0 && submitedFirst}
            >
              <option>Add New element</option>
              {dbGenre.map((genre) => (<option key={genre.name} value={genre.name}>{genre.name}</option>))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Tem que selecionar pelo menos um género
            </Form.Control.Feedback>
          </Col>
          <Col sm={6}>
            <Form.Label>Adicionar novo</Form.Label>
            <Form.Control
              type="text"
              autoFocus
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              isInvalid={genres.length === 0 && submitedFirst}
            />
          </Col>
          <Col sm={1}>
            <IoAdd
              size={25}
              color="white"
              className="addButton"
              onClick={() => {
                let array = genres;
                if (!array.includes(newGenre) && newGenre !== "") {
                  setGenres((genre) => [...genre, newGenre])
                }
                setNewGenre("");
              }}
            />
          </Col>
        </Row>
        <Row> {genres && <SelectAndAdd array={genres} setValues={setGenres} />} </Row>

      </Form.Group>
      <Form.Group className="mb-2" controlId="idiom">
        <Row>
          <Form.Label><b>Idioma</b></Form.Label>
        </Row>
        <Row>
          <Col sm={5}>
            <Form.Label>Escolher Existente</Form.Label>
            <Form.Select
              value={formData.idiom}
              onChange={
                (e) => {
                  setFormData({ ...formData, idiom: e.target.value })
                  setNewIdiom("");
                }
              }
              isInvalid={formData.idiom === "" && submitedFirst}
            >
              <option>Add New element</option>
              {dbIdiom.map((idiom) => (<option key={idiom.name} value={idiom.name}>{idiom.name}</option>))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Tem que selecionar um idioma
            </Form.Control.Feedback>
          </Col>
          <Col sm={6}>
            <Form.Label>Adicionar novo</Form.Label>
            <Form.Control
              type="text"
              autoFocus
              value={newIdiom}
              onChange={(e) => {
                setNewIdiom(e.target.value);
                setFormData({ ...formData, idiom: e.target.value })
              }}
              isInvalid={formData.idiom === "" && submitedFirst}
            />
          </Col>
        </Row>
      </Form.Group>
      <Row>
        <Col sm={5}>
          <Form.Group className="mb-2" controlId="loc">
            <Form.Label><b>Localização</b></Form.Label>
            <Form.Control
              type="text"
              placeholder="Sótão - Prateleira 1"
              autoFocus
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              isInvalid={formData.location === "" && submitedFirst}
            />
            <Form.Control.Feedback type="invalid">
              Tem que indicar uma localização.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="formFile" className="mb-2">
            <Form.Label><b>Imagem</b></Form.Label>
            <Form.Control type="file" />
          </Form.Group>
        </Col>
      </Row>
      < Button variant="primary" type="submit">
        Adicionar Livro
      </Button>
    </Form>);
}

export default FormModalAddBook;
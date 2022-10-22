import { useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { IoLocationSharp } from "react-icons/io5"

const LivroCard = ({ book, selectedInfo, setSelectedInfo }) => {
    const [active, setActive] = useState(false);

    console.log(book)

    useEffect(() => {
        function changeData() {
            if (book.id === selectedInfo) setActive(true);
            else setActive(false);
        }
        changeData();
    }, [book.id, selectedInfo, setSelectedInfo])


    return (
        <Card
            border={active ? "primary" : ""}
            style={{ marginTop: "5px", marginBottom: "10px" }}
            onClick={() => {
                !active ? setSelectedInfo(book.id) : setSelectedInfo(null)
            }}>
            <Card.Img variant="top" src={"No_Cover.jpg"} style={{ paddingInline: "50px" }}></Card.Img>
            <Card.Body>
                <div className="titleIcon">
                    <div>
                        <Card.Title>{book.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            {Array.from(book.author).map((a, idx) => {
                                if(idx === book.author.length-1) return <>{a.name}</>
                                else return <>{a.name} | </>
                            })}
                        </Card.Subtitle>
                    </div>
                </div>
                <Card.Text className="desc">{book.desc}</Card.Text>
                <Card.Text><b>Idioma:</b> {book.idiom.name}</Card.Text>
                <Card.Title>Género: </Card.Title>
                <ListGroup>
                    <div className="listContainer">
                        {Array.from(book.genre).map((g) => (
                            <ListGroup.Item>{g.name}</ListGroup.Item>
                        ))}
                    </div>
                </ListGroup>
            </Card.Body>
            <Card.Footer>
                <small className="text-muted"><IoLocationSharp /> {book.location.name}</small>
            </Card.Footer>
        </Card>
    );
}

export default LivroCard;
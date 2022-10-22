import { Container, Row, Col, CloseButton } from "react-bootstrap";

const SelectAndAdd = ({ array, setValues }) => {
  return (
    <Container className="my-1">
      <Row xs={0} md={5}>
        {array.map((value) => (
          <Col key={value} md="auto">
            <div className="addedElem" key={value}>
              {value}
              <CloseButton onClick={() => {
                setValues(current =>
                  current.filter(v => {
                    return v !== value;
                  }),
                )
              }} />
            </div>
          </Col>
        ))}
      </Row>
    </Container>);
}

export default SelectAndAdd;
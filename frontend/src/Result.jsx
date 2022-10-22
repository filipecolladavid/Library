import { Row, Col } from "react-bootstrap"

import LivroCard from "./LivroCard";

const Result = ({ response, selectedInfo, setSelectedInfo, queryTip }) => {
  return (
    <>
      {
        !response || response.length === 0 ?
          <>Não existem resultados para essa pesquisa</>
          :
          <>
          <>Pesquisa para {queryTip}</>
          <Row xs={0} md={3} sm={1}>
            {Array.from(response).map((book) => (
              <Col key={book.id}>
                <LivroCard book={book} selectedInfo={selectedInfo} setSelectedInfo={setSelectedInfo} />
              </Col>
            ))}
          </Row>
          </>
      }
    </>
  );
}

export default Result;
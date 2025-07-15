import { Container, Row, Col } from 'react-bootstrap';

export default function SponsorsContainer() {
  return (
      <Container className='py-1'>
        <h5 className="text-center mb-4 fs-4">Our sponsors</h5>
        <Row className="justify-content-center align-items-center">
          <Col xs={6} md={3} className="text-center mb-4">
            <img src="src/assets/sponsors/bootstrap-logo.png" alt="Patrocinador 4" className="img-fluid" style={{ maxHeight: '60px' }} />
          </Col>
          <Col xs={6} md={3} className="text-center mb-4">
            <img src="src/assets/sponsors/ifce-logo.png" alt="Patrocinador 2" className="img-fluid" style={{ maxHeight: '80px' }} />
          </Col>
          <Col xs={6} md={3} className="text-center mb-4">
            <img src="src/assets/sponsors/ufc-logo.png" alt="Patrocinador 4" className="img-fluid" style={{ maxHeight: '80px' }} />
          </Col>
          <Col xs={6} md={3} className="text-center mb-4">
            <img src="src/assets/sponsors/js-logo.png" alt="Patrocinador 4" className="img-fluid" style={{ maxHeight: '60px' }} />
          </Col>
        </Row>
      </Container>
  );
}


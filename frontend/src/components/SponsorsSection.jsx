import { Container, Row, Col } from 'react-bootstrap';

export default function SponsorsSection() {
  return (
    <section className="py-5" style={{backgroundColor:'var(dark-blue-color)'}}>
      <Container>
        <h5 className="text-center mb-4">Nossos Patrocinadores</h5>
        <Row className="justify-content-center align-items-center">
          {/* Substitua os src pelos caminhos reais das suas logos */}
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
    </section>
  );
}


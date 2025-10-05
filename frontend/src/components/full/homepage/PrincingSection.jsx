import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import styles from '../../../styles/HomePage.module.css';


export default function PricingSection() {
  return (
    <section id="pricing" className="py-5 bg-light">
      <Container>
        <h2 className="text-center mb-4" style={{ fontSize: '2.2rem' }}>Our Pricing Plans</h2>
        <p className="text-center mb-5 text-muted fs-5">Choose the perfect plan for you or your company.</p>

        <Row className="justify-content-center">

          {/* Plano Gratuito */}
          <Col md={4} className="mb-4">
            <Card className={`h-100 ${styles.freeCard}`}>
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h5" className="text-center fs-4">Free</Card.Title>
                <Card.Subtitle className="mb-2 text-center text-muted">Ideal for getting started</Card.Subtitle>
                <h3 className="text-center my-3">US$0<small className="text-muted">/month</small></h3>
                <Card.Text className="text-center mb-4">Enjoy the basic features free of charge.</Card.Text>
                <ListGroup variant="flush" className="flex-grow-1">
                  <ListGroup.Item style={{ fontSize: 'large' }}><i className="bi bi-check-circle-fill text-success me-2"></i>Limited access to resources</ListGroup.Item>
                  <ListGroup.Item style={{ fontSize: 'large' }}><i className="bi bi-check-circle-fill text-success me-2"></i>Email support</ListGroup.Item>
                </ListGroup>
                <div className="mt-auto text-center">
                  <Button className="w-75 fs-5" onClick={() => alert('Not implemented')}>Start Free</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Plano Família e Amigos */}
          <Col md={4} className="mb-4">
            <Card className={`h-100 border border-primary ${styles.familyCard}`}> {/* Apenas borda azul claro */}
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h5" className="text-center text-primary fs-4">Family and Friends</Card.Title>
                <Card.Subtitle className="mb-2 text-center text-muted">Share with those you love</Card.Subtitle>
                <h3 className="text-center my-3">US$29<small className="text-muted">/month</small></h3>
                <Card.Text className="text-center mb-4">Perfect for small groups and personal use.</Card.Text>
                <ListGroup variant="flush" className="flex-grow-1">
                  <ListGroup.Item style={{ fontSize: 'large' }}><i className="bi bi-check-circle-fill text-success me-2"></i>All the features of the Free plan</ListGroup.Item>
                  <ListGroup.Item style={{ fontSize: 'large' }}><i className="bi bi-check-circle-fill text-success me-2"></i>Up to 2 groups</ListGroup.Item>
                  <ListGroup.Item style={{ fontSize: 'large' }}><i className="bi bi-check-circle-fill text-success me-2"></i>Sharing</ListGroup.Item>
                </ListGroup>
                <div className="mt-auto text-center">
                  <Button className={`w-75 mb-2 fs-5 ${styles.familyBtn1}`} onClick={() => alert('Not implemented')}>Subscribe Now</Button>
                  <Button variant="outline-custom" className={`w-75 fs-5 ${styles.familyBtn2}`} onClick={() => alert('Not implemented')}>Learn More</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Plano Empresarial */}
          <Col md={4} className="mb-4">
            <Card text="white" className={`h-100 ${styles.businessCard}`}>
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h5" className="text-center fs-4">Corporate</Card.Title>
                <Card.Subtitle className="mb-2 text-center text-light">Complete solutions for companies</Card.Subtitle>
                <h3 className="text-center my-3">US$99<small className="text-light">/month</small></h3>
                <Card.Text className="text-center mb-4">Maximize your team's productivity.</Card.Text>
                <ListGroup variant="flush" className={`flex-grow-1 mb-3 fs-5 ${styles.businessFeatures}`}>
                  <ListGroup.Item className="text-white" style={{ fontSize: 'large' }}><i className="bi bi-check-circle-fill text-white me-2"></i>All the features of the previous plans</ListGroup.Item>
                  <ListGroup.Item className="text-white" style={{ fontSize: 'large' }}><i className="bi bi-check-circle-fill text-white me-2"></i>Unlimited groups</ListGroup.Item>
                  <ListGroup.Item className="text-white" style={{ fontSize: 'large' }}><i className="bi bi-check-circle-fill text-white me-2"></i>Unlimited users per group</ListGroup.Item>
                  <ListGroup.Item className="text-white" style={{ fontSize: 'large' }}><i className="bi bi-check-circle-fill text-white me-2"></i>Priority support</ListGroup.Item>
                </ListGroup>
                <div className="mt-auto text-center">
                  <Button variant="light" className="w-75 mb-2 fs-5" onClick={() => alert('Not implemented')}>Subscribe Now</Button>
                  <Button className={`w-75 fs-5 ${styles.demoBtn}`} id='demo-btn' onClick={() => alert('Not implemented')}>Request Demo</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </section>
  );
};

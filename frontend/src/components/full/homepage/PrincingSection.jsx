import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import styles from '../../../styles/HomePage.module.css';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-5">
      <Container>
        <h2 className="text-center mb-4">Nossos Planos de Preço</h2>
        <p className="text-center mb-5 text-muted">Escolha o plano perfeito para você ou sua empresa.</p>

        <Row className="justify-content-center">

          {/* Plano Gratuito */}
          <Col md={4} className="mb-4">
            <Card className={`h-100 ${styles.freeCard}`}>
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h5" className="text-center">Gratuito</Card.Title>
                <Card.Subtitle className="mb-2 text-center text-muted">Ideal para começar</Card.Subtitle>
                <h3 className="text-center my-3">R$0<small className="text-muted">/mês</small></h3>
                <Card.Text className="text-center mb-4">Aproveite os recursos básicos sem custo.</Card.Text>
                <ListGroup variant="flush" className="flex-grow-1">
                  <ListGroup.Item><i className="bi bi-check-circle-fill text-success me-2"></i>Acesso limitado a recursos</ListGroup.Item>
                  <ListGroup.Item><i className="bi bi-check-circle-fill text-success me-2"></i>Suporte por e-mail</ListGroup.Item>
                </ListGroup>
                <div className="mt-auto text-center">
                  <Button className="w-75">Começar Grátis</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Plano Família e Amigos */}
          <Col md={4} className="mb-4">
            <Card className={`h-100 border border-primary ${styles.familyCard}`}> {/* Apenas borda azul claro */}
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h5" className="text-center text-primary">Família e Amigos</Card.Title>
                <Card.Subtitle className="mb-2 text-center text-muted">Compartilhe com quem você ama</Card.Subtitle>
                <h3 className="text-center my-3">R$29<small className="text-muted">/mês</small></h3>
                <Card.Text className="text-center mb-4">Perfeito para grupos pequenos e uso pessoal.</Card.Text>
                <ListGroup variant="flush" className="flex-grow-1">
                  <ListGroup.Item><i className="bi bi-check-circle-fill text-success me-2"></i>Todos os recursos do plano Gratuito</ListGroup.Item>
                  <ListGroup.Item><i className="bi bi-check-circle-fill text-success me-2"></i>Até 2 grupos</ListGroup.Item>
                  <ListGroup.Item><i className="bi bi-check-circle-fill text-success me-2"></i>Compartilhamento</ListGroup.Item>
                </ListGroup>
                <div className="mt-auto text-center">
                  <Button className={`w-75 mb-2 ${styles.familyBtn1}`}>Assinar Agora</Button>
                  <Button variant="outline-custom" className={`w-75 ${styles.familyBtn2}`}>Saber Mais</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Plano Empresarial */}
          <Col md={4} className="mb-4">
            <Card text="white" className={`h-100 ${styles.businessCard}`}> 
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h5" className="text-center">Empresarial</Card.Title>
                <Card.Subtitle className="mb-2 text-center text-light">Soluções completas para empresas</Card.Subtitle>
                <h3 className="text-center my-3">R$99<small className="text-light">/mês</small></h3>
                <Card.Text className="text-center mb-4">Maximize a produtividade da sua equipe.</Card.Text>
                <ListGroup variant="flush" className={`flex-grow-1 mb-3 ${styles.businessFeatures}`}>
                  <ListGroup.Item className="text-white"><i className="bi bi-check-circle-fill text-white me-2"></i>Todos os recursos dos planos anteriores</ListGroup.Item>
                  <ListGroup.Item className="text-white"><i className="bi bi-check-circle-fill text-white me-2"></i>Grupos ilimitados</ListGroup.Item>
                  <ListGroup.Item className="text-white"><i className="bi bi-check-circle-fill text-white me-2"></i>Usuários ilimitados por grupo</ListGroup.Item>
                    <ListGroup.Item className="text-white"><i className="bi bi-check-circle-fill text-white me-2"></i>Suporte prioritário</ListGroup.Item>
                </ListGroup>
                <div className="mt-auto text-center">
                  <Button variant="light" className="w-75 mb-2">Assinar Agora</Button>
                  <Button className={`w-75 ${styles.demoBtn}`} id='demo-btn'>Solicitar Demonstração</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </section>
  );
};

import { Container, Row, Col, Button } from 'react-bootstrap';
import {SponsorsContainer} from '..';
import SiteIcon from '../../assets/site-icon.svg?react';
import styles from '../../styles/HomePage.module.css';

export default function HeroSection() {
  return (
    <section className={`py-5 ${styles.heroSection}`}>
      <Container className='pb-4'>
        <Row className="align-items-center">
          {/* Texto à esquerda */}
          <Col md={6} className="text-start">
            <h1 className="display-4 fw-bold">Welcome to<br />SafeLock</h1>
            <p className="lead">
              Aqui você pode descobrir nossos serviços e explorar tudo que temos a oferecer.  
            </p>
            <div className="d-flex gap-3 mt-4">
              <Button size="lg" className={styles.getStartedBtn}>Get Started</Button>
              <Button href='#footer' variant="outline-custom" size="lg" className={styles.aboutUsBtn}>About Us</Button>
            </div>
          </Col>

          <Col md={6} className="text-center">
            <SiteIcon className={styles.heroSecIcon}/>
          </Col>
        </Row>
      </Container>

      <hr className="mt-5 mb-4 mx-auto" style={{width: '85%'}} />
      <SponsorsContainer/>
    </section>
  );
}


import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import {SponsorsContainer} from './';
import SiteIcon from '../assets/site-icon.svg?react';

export default function HeroSection() {
  return (
    <section className="py-5 hero-section">
      <Container className='pb-4'>
        <Row className="align-items-center">
          {/* Texto à esquerda */}
          <Col md={6} className="text-start">
            <h1 className="display-4 fw-bold">Welcome to<br />SafeLock</h1>
            <p className="lead">
              Aqui você pode descobrir nossos serviços e explorar tudo que temos a oferecer.  
            </p>
            <div className="d-flex gap-3 mt-4">
              <Button size="lg" id='getstarted-btn'>Get Started</Button>
              <Button variant="outline-custom" size="lg" id='aboutus-btn'>About Us</Button>
            </div>
          </Col>

          <Col md={6} className="text-center">
            <SiteIcon id='herosec-icon'/>
          </Col>
        </Row>
      </Container>

      <hr className="mt-5 mb-4 mx-auto" style={{width: '85%'}} />
      <SponsorsContainer/>
    </section>
  );
}


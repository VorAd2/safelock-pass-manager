import '../index.css'
import SiteIcon from '../assets/site-icon.svg?react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';

function Header() {
  return (
    <Navbar bg="light" expand="md" className="py-2">
      <Container fluid>
        {/* Logo à esquerda */}
        <Navbar.Brand href="#" className="ps-3">
          <SiteIcon style={{fill: 'var(--yellow-color)', height: 30, width: 30, marginRight: '0.5rem'}} />
          SafeLock
        </Navbar.Brand>

        {/* Menu colapsável para mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          {/* Opções centralizadas */}
          <Nav className="mx-auto gap-4">
            <Nav.Link href="#tools">Tools & Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <Nav.Link href="#downloads">Downloads</Nav.Link>
          </Nav>

          {/* Login e Registro à direita */}
          <div className="d-flex gap-2 pe-3">
            <button type='button' id='login-btn' className='btn btn-outline-custom' style={{color: 'var(--dark-blue-color)'}}>Log in</button>
            <button type='button' id='register-btn' className='btn'>Register</button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

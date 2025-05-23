import SiteIcon from '../../assets/site-icon.svg?react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SIGNIN_ROUTE, SIGNUP_ROUTE } from '../../routes';

function Header() {
  return (
    <Navbar bg="light" expand="md" className="py-2">
      <Container fluid>
        <Navbar.Brand href="#" className="ps-3 fw-bold" style={{color: 'var(--lessdark-blue-color)'}}>
          <SiteIcon style={{fill: 'var(--dark-yellow-color)', height: 30, width: 30, marginRight: '0.5rem'}} />
          SafeLock
        </Navbar.Brand>

        {/* Menu colapsável para mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav className="mx-auto gap-4" id='header-options'>
            <Nav.Link href="#features">Tools & Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <Nav.Link href="#downloads">Downloads</Nav.Link>
          </Nav>

          <div className="d-flex gap-2 pe-3">
            <Link
              to={SIGNIN_ROUTE} 
              id='login-btn'
              className='btn btn-outline-custom' 
              style={{ color: 'var(--dark-blue-color)' }}
            >
            Sign In
            </Link>
            <Link
              to={SIGNUP_ROUTE} 
              id='register-btn'
              className='btn'
            >
            Sign Up
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

import SiteIcon from '../../../assets/shared/site-icon.svg?react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SIGNIN_ROUTE, SIGNUP_ROUTE } from '../../../routes';
import styles from '../../../styles/HomePage.module.css';

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
          <Nav className={`mx-auto gap-4 ${styles.headerOptions}`}>
            <Nav.Link href="#features">Tools & Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <Nav.Link href="#downloads">Downloads</Nav.Link>
          </Nav>

          <div className="d-flex gap-2 pe-3">
            <Link
              to={SIGNIN_ROUTE} 
              className={`btn btn-outline-custom ${styles.loginBtn}`} 
              style={{ color: 'var(--dark-blue-color)' }}
            >
            Sign In
            </Link>
            <Link
              to={SIGNUP_ROUTE} 
              className={`btn ${styles.registerBtn}`}
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

import SiteIcon from '../../../assets/shared/site-icon.svg?react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SIGNIN_ROUTE, SIGNUP_ROUTE } from '../../../routes';
import styles from '../../../styles/HomePage.module.css';

function Header() {

  const handleScrollToSection = (id) => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarToggler && navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarToggler.click(); 
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Navbar bg="light" expand="md" className="py-2">
      <Container fluid>
        <Navbar.Brand href="#" className="ps-3 fw-bold fs-3 d-flex justify-items-center align-items-center" style={{color: 'var(--lessdark-blue-color)'}}>
          <SiteIcon style={{fill: 'var(--dark-yellow-color)', height: 37, width: 37, marginRight: '0.5rem'}} />
          SafeLock
        </Navbar.Brand>

        {/* Menu colapsável para mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav className={`mx-auto gap-4 fs-5 ${styles.headerOptions}`}>
            <Nav.Link onClick={() => handleScrollToSection('features')}>Tools & Features</Nav.Link>
            <Nav.Link onClick={() => handleScrollToSection('downloads')}>Downloads</Nav.Link>
            <Nav.Link onClick={() => handleScrollToSection('pricing')}>Pricing</Nav.Link>
          </Nav>

          <div className="d-flex gap-2 pe-3">
            <Link
              to={SIGNIN_ROUTE} 
              className={`btn btn-outline-custom fs-5 ${styles.loginBtn}`} 
              style={{ color: 'var(--dark-blue-color)' }}
            >
            Sign In
            </Link>
            <Link
              to={SIGNUP_ROUTE} 
              className={`btn fs-5 ${styles.registerBtn}`}
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

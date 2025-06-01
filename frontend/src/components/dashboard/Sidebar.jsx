import { useState } from 'react';
import { Offcanvas, Form, Button, Nav } from 'react-bootstrap';
import SidebarSection from './SidebarSection';
import styles from '../../styles/Sidebar.module.css'; // Importa o CSS Module

function Sidebar() {
  const [show, setShow] = useState(true); 

  const handleToggle = () => setShow(!show);

  return (
    <>
      <Offcanvas show={show} onHide={handleToggle} placement="start" className={styles.customOffcanvas}>
        <Offcanvas.Header closeButton className="d-lg-none"> {/* Botão de fechar visível apenas em telas pequenas */}
          <Offcanvas.Title>Navegação</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">
          {/* 1. Barra de Pesquisa no Topo */}
          <Form className="d-flex p-3">
            <Form.Control
              type="search"
              placeholder="Pesquisar..."
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">🔍</Button>
          </Form>

          {/* 2. Seções da Sidebar */}
          <Nav className="flex-column flex-grow-1">
            <SidebarSection
              title="Manager"
              options={[
                { name: 'Dashboard', href: '#' },
                { name: 'Usuários', href: '#' },
                { name: 'Configurações', href: '#' }
              ]}
            />
            <SidebarSection
              title="Wallet"
              options={[
                { name: 'Transações', href: '#' },
                { name: 'Contas', href: '#' },
                { name: 'Métodos de Pagamento', href: '#' }
              ]}
            />
            <SidebarSection
              title="Support"
              options={[
                { name: 'Central de Ajuda', href: '#' },
                { name: 'Contate-nos', href: '#' },
                { name: 'FAQs', href: '#' }
              ]}
            />
          </Nav>

          {/* 3. Seção no Bottom com Linha Divisória e Botão */}
          <div className="mt-auto p-3">
            <hr className="bg-light" />
            <Button variant="outline-light" className="w-100" onClick={handleToggle}>
              {show ? 'Fechar Sidebar' : 'Abrir Sidebar'}
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Botão para abrir a sidebar (visível quando a sidebar está fechada ou em telas menores) */}
      {!show && (
        <Button variant="primary" onClick={handleToggle} className="m-3 d-lg-none position-fixed top-0 start-0">
          Abrir Sidebar
        </Button>
      )}
    </>
  );
}

export default Sidebar;
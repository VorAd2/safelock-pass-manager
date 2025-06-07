import { Container, Row, Col } from 'react-bootstrap';
import styles from '../../styles/MainContent.module.css'; 

function MainContent({ isSidebarExpanded }) {
  // Ajusta a margem esquerda do conteúdo principal com base no estado da sidebar
  const marginLeft = isSidebarExpanded
    ? 'var(--sidebar-width-expanded)'
    : 'var(--sidebar-width-collapsed)';

  return (
    <div
      className={`${styles.mainContentContainer} p-4`}
      style={{ marginLeft: marginLeft }}
    >
      <Container fluid>
        <Row>
          <Col>
            <h1>Dashboard Principal</h1>
            <p>
              Bem-vindo ao seu painel! O conteúdo aqui se ajusta
              automaticamente ao lado da sidebar.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MainContent;
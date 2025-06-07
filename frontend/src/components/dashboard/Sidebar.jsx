import { Form, Button, Nav } from 'react-bootstrap';
import SidebarSection from './partials/SidebarSection';
import styles from '../../styles/Sidebar.module.css'; 

function Sidebar({ isExpanded, toggleSidebar }) {
  const sidebarClassName = isExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed;

  return (
    <div className={`${styles.sidebarContainer} ${sidebarClassName}`}>
      {/* Barra de Pesquisa no Topo */}
      <Form className="d-flex p-3">
        <Form.Control
          type="search"
          placeholder={isExpanded ? "Pesquisar..." : "🔍"}
          className="me-2"
          aria-label="Search"
          style={{ minWidth: isExpanded ? '100px' : 'auto' }}
        />
        {isExpanded && <Button variant="outline-light">🔍</Button>}
      </Form>

      {/* Seções da Sidebar */}
      <Nav className="flex-column flex-grow-1">
        <SidebarSection
          title="Manager"
          options={[
            { name: 'Dashboard', href: '#dashboard' },
            { name: 'Usuários', href: '#users' },
            { name: 'Configurações', href: '#settings' }
          ]}
          isExpanded={isExpanded}
        />
        <SidebarSection
          title="Wallet"
          options={[
            { name: 'Transações', href: '#transactions' },
            { name: 'Contas', href: '#accounts' },
            { name: 'Métodos de Pagamento', href: '#payment-methods' }
          ]}
          isExpanded={isExpanded}
        />
        <SidebarSection
          title="Support"
          options={[
            { name: 'Help Center', href: '#help' },
            { name: 'Contact Us', href: '#contact' },
            { name: 'FAQs', href: '#faqs' }
          ]}
          isExpanded={isExpanded}
        />
      </Nav>

      {/* Seção no Bottom com Linha Divisória e Botão */}
      <div className="mt-auto p-3">
        <hr className="bg-light" />
        <Button variant="outline-light" className={`w-100 ${styles.sidebarToggleBtn}`} onClick={toggleSidebar}>
          {isExpanded ? '⚡️ Encolher' : '➡️'}
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
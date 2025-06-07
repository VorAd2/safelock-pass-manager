import { Form, Nav } from 'react-bootstrap';
import SidebarSection from './partials/SidebarSection';
import SidebarFooter from './partials/SidebarFooter';
import {SearchIcon } from '../../assets/dashboard';
import styles from '../../styles/Sidebar.module.css'; 

function Sidebar({ isExpanded, toggleSidebar }) {
  const sidebarClassName = isExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed;

  return (
    <div className={`${styles.sidebarContainer} ${sidebarClassName}`}>
      <Form className="d-flex p-3">
        <Form.Control
          type="search"
          placeholder={isExpanded ? "Search..." : SearchIcon}
          className={`me-2 ${styles.searchBox}`}
          aria-label="Search"
          style={{ minWidth: isExpanded ? '100px' : 'auto', fill: 'black' }}
        />
      </Form>


      <Nav className="flex-column flex-grow-1">
        <SidebarSection
          title="Manager"
          options={[
            { name: 'Vaults', href: '#vaults' },
            { name: 'Tools', href: '#tools' },
            { name: 'Send', href: '#send' }
          ]}
          isExpanded={isExpanded}
          iconClassName={styles.sidebarIcon}
          textClassName={styles.sidebarText}
        />
        <SidebarSection
          title="Wallet"
          options={[
            { name: 'Cards', href: '#cards' },
            { name: 'Receipts', href: '#receips' }
          ]}
          isExpanded={isExpanded}
          iconClassName={styles.sidebarIcon}
          textClassName={styles.sidebarText}
        />
        <SidebarSection
          title="Support"
          options={[
            { name: 'Settings', href: '#settings' },
            { name: 'Contact Us', href: '#contactus' },
          ]}
          isExpanded={isExpanded}
          iconClassName={styles.sidebarIcon}
          textClassName={styles.sidebarText}
        />
      </Nav>

      <SidebarFooter isExpanded={isExpanded} onClick={toggleSidebar} />
    </div>
  );
}

export default Sidebar;
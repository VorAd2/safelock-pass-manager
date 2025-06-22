import { Nav } from 'react-bootstrap';
import SidebarSection from '../../partials/dashboard/sidebar/SidebarSection';
import SidebarFooter from '../../partials/dashboard/sidebar/SidebarFooter';
import SiteIcon from '../../../assets/shared/site-icon.svg?react';
import styles from '../../../styles/Sidebar.module.css'; 

function Sidebar({ isExpanded, toggleSidebar }) {
  const sidebarClassName = isExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed;

  return (
    <div className={`${styles.sidebarContainer} ${sidebarClassName}`}>
      <div className={styles.logoSection}>
        <SiteIcon className={styles.siteIcon} />
        <span className={styles.siteNameText}>SafeLock</span>
      </div>

      <Nav className="flex-column flex-grow-1">
        <SidebarSection
          title="Manager"
          options={[
            { name: 'Vaults', href: 'vaults' },
            { name: 'Tools', href: 'tools' },
            { name: 'Send', href: 'send' }
          ]}
          isExpanded={isExpanded}
          iconClassName={styles.sidebarIcon}
          textClassName={styles.sidebarText}
        />
        <SidebarSection
          title="Wallet"
          options={[
            { name: 'Cards', href: 'cards' },
            { name: 'Receipts', href: 'receipts' }
          ]}
          isExpanded={isExpanded}
          iconClassName={styles.sidebarIcon}
          textClassName={styles.sidebarText}
        />
        <SidebarSection
          title="Support"
          options={[
            { name: 'Settings', href: 'settings' },
            { name: 'ContactUs', href: 'contactus' },
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
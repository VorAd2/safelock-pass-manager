import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import SidebarSection from './partials/SidebarSection';
import SidebarFooter from './partials/SidebarFooter';
import SiteIcon from '../../assets/site-icon.svg?react';
import styles from '../../styles/Sidebar.module.css'; 

function Sidebar({ isExpanded, toggleSidebar, setMainContent }) {
  const sidebarClassName = isExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed;
  const [activeNavLink, setActiveNavLink] = useState('vaults')
  const handleNavLinkClick = (name) => {
    setActiveNavLink(name)
    setMainContent(activeNavLink)
  }

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
            { name: 'Vaults', href: '#vaults' },
            { name: 'Tools', href: '#tools' },
            { name: 'Send', href: '#send' }
          ]}
          isExpanded={isExpanded}
          iconClassName={styles.sidebarIcon}
          textClassName={styles.sidebarText}
          activeNavLink={activeNavLink}
          onNavLinkClick={handleNavLinkClick}
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
          activeNavLink={activeNavLink}
          onNavLinkClick={handleNavLinkClick}
        />
        <SidebarSection
          title="Support"
          options={[
            { name: 'Settings', href: '#settings' },
            { name: 'ContactUs', href: '#contactus' },
          ]}
          isExpanded={isExpanded}
          iconClassName={styles.sidebarIcon}
          textClassName={styles.sidebarText}
          activeNavLink={activeNavLink}
          onNavLinkClick={handleNavLinkClick}
        />
      </Nav>

      <SidebarFooter isExpanded={isExpanded} onClick={toggleSidebar} />
    </div>
  );
}

export default Sidebar;
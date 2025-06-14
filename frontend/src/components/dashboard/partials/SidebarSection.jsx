/* eslint-disable no-unused-vars */
import { Nav } from 'react-bootstrap';
import {VaultIcon,
    FeaturesIcon,
    SendIcon,
    CardIcon,
    ReceiptIcon,
    InfoIcon,
    SettingsIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
  } from '../../../assets/dashboard';
import styles from '../../../styles/Sidebar.module.css';
import sectionStyles from '../../../styles/SidebarSection.module.css'; 

const iconMap = {
  'vaults': VaultIcon,
  'tools': FeaturesIcon,
  'send': SendIcon,
  'cards': CardIcon,
  'receipts': ReceiptIcon,
  'contactus': InfoIcon,
  'settings': SettingsIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon
}

function SidebarSection(
  { title, options, isExpanded, iconClassName, textClassName, activeNavLink, onNavLinkClick })
  {
  return (
    <div className="mb-2">
      {isExpanded && <h5 className={`px-3  text-white ${sectionStyles.sectionTitle}`}>{title}</h5>}
      <Nav className="flex-column">
        {options.map((option, _) => {
          const iconKey = option.name.toLowerCase()
          const isActive = iconKey == activeNavLink
          const IconComponent = iconMap[iconKey]
          return (
            <Nav.Link key={option.href} href={option.href} className={isActive ? 'active' : 'inactive'} onClick={() => onNavLinkClick(iconKey)}>
              {isActive && <div className={styles.activeRectangle}></div>}
              <span className={iconClassName}>
              {IconComponent ? <IconComponent /> : <span>?</span>}
              </span>
              <span className={textClassName}>
                {option.name}
              </span>
            </Nav.Link>
          )
          })
        } 
      </Nav>
    </div>
  );
}

export default SidebarSection;
/* eslint-disable no-unused-vars */
import { NavLink as RouterNavLink} from 'react-router-dom';
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
  } from '../../../../assets/dashboard';
import styles from '../../../../styles/Sidebar.module.css';
import sectionStyles from '../../../../styles/SidebarSection.module.css'; 

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
  { title, options, isExpanded, iconWrapperClassName, textClassName })
  {
  return (
    <div className="mb-3">
      {isExpanded && <h5 className={`px-3  text-white ${sectionStyles.sectionTitle}`}>{title}</h5>}
      <Nav className="flex-column">
        {options.map((option, _) => {
          const iconName = option.name.toLowerCase()
          const IconComponent = iconMap[iconName]
          const toPath = option.href
          return (
            <RouterNavLink 
              key={toPath} 
              to={toPath} 
              className={({isActive}) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
            >
              {({isActive}) => {
                  return (
                    <>
                      {isActive && <div className={styles.activeRectangle}></div>}
                      <span className={iconWrapperClassName}>
                        {IconComponent ? <IconComponent className={styles.sidebarIcon} /> : <span>?</span>}
                      </span>
                      <span className={textClassName}>
                        {option.name}
                      </span>
                    </>
                  )
                }
              }
            </RouterNavLink>
          )
          })
        } 
      </Nav>
      {(!isExpanded && title != 'Support') && <hr className={styles.sectionDividerCollapsed}/>}
    </div>
  );
}

export default SidebarSection;
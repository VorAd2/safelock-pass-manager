/* eslint-disable no-unused-vars */
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import {
  VaultIcon2,
  FeaturesIcon,
  SendIcon,
  CardIcon,
  ReceiptIcon,
  InfoIcon,
  SettingsIcon,
  ArrowLeftIcon,
  ArrowRightIcon2,
} from '../../../../assets/dashboard';
import styles from '../../../../styles/Sidebar.module.css';

const iconMap = {
  'vaults': VaultIcon2,
  'generator': FeaturesIcon,
  'send': SendIcon,
  'cards': CardIcon,
  'receipts': ReceiptIcon,
  'contactus': InfoIcon,
  'settings': SettingsIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon2
}

function SidebarSection(
  { title, options, isExpanded, iconWrapperClassName, textClassName }) {
  return (
    <section className="mb-4">
      {isExpanded && <h5 className={`px-3  text-white ${styles.sectionTitle}`}>{title}</h5>}
      <Nav className="flex-column">
        <ul style={{ listStyleType: 'none', margin: '0', padding: '0' }}>
          {options.map((option, _) => {
            const iconName = option.name.toLowerCase()
            const IconComponent = iconMap[iconName]
            const toPath = option.href
            return (
              <li key={toPath}>
                <RouterNavLink
                  key={toPath}
                  to={toPath}
                  className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
                >
                  {({ isActive }) => {
                    return (
                      <>
                        {isActive && <div className={styles.activeRectangle}></div>}
                        <span className={iconWrapperClassName}>
                          {IconComponent ? <IconComponent className={styles.sidebarIcon} /> : <span>?</span>}
                        </span>
                        <span className={textClassName}>
                          {option.name === 'ContactUs' ? 'Contact Us' : option.name}
                        </span>
                      </>
                    )
                  }
                  }
                </RouterNavLink>
              </li>
            )
          })
          }
        </ul>

      </Nav>
      {(!isExpanded && title != 'Support') && <hr className={styles.sectionDividerCollapsed} />}
    </section>
  )
}

export default SidebarSection;
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
import sectionStyles from '../../../styles/SidebarSection.module.css'; 

const iconMap = {
  'vaults': VaultIcon,
  'tools': FeaturesIcon,
  'send': SendIcon,
  'cards': CardIcon,
  'receipts': ReceiptIcon,
  'contact us': InfoIcon,
  'settings': SettingsIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon
}

function SidebarSection({ title, options, isExpanded, iconClassName, textClassName }) {
  return (
    <div className="mb-2">
      {isExpanded && <h5 className={`px-3 pt-2 text-white ${sectionStyles.sectionTitle}`}>{title}</h5>}
      <Nav className="flex-column">
        {options.map((option, index) => {
          const iconKey = option.name.toLowerCase()
          const IconComponent = iconMap[iconKey]
          return (
          <Nav.Link key={index} href={option.href}>
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
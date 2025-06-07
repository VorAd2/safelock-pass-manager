import { Nav } from 'react-bootstrap';
import sectionStyles from '../../../styles/SidebarSection.module.css'; 

const iconMap = {
  'Dashboard': '🏠',
  'Usuários': '👤',
  'Configurações': '⚙️',
  'Transações': '📈',
  'Contas': '💳',
  'Payment Methods': '💰',
  'Help Center': '❓',
  'Contact Us': '📞',
  'FAQs': '📚',
};

function SidebarSection({ title, options, isExpanded }) {
  return (
    <div className="mb-2">
      {isExpanded && <h5 className={`px-3 pt-3 text-white ${sectionStyles.sectionTitle}`}>{title}</h5>}
      <Nav className="flex-column">
        {options.map((option, index) => (
          // As classes 'sidebar-icon' e 'sidebar-text' virão do Sidebar.module.css via componente pai
          <Nav.Link key={index} href={option.href}>
            <span className="sidebar-icon">
              {iconMap[option.name] || '•'}
            </span>
            <span className="sidebar-text">
              {option.name}
            </span>
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
}

export default SidebarSection;
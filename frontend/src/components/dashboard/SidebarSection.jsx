import { Nav } from 'react-bootstrap';

function SidebarSection({ title, options }) {
  return (
    <div className="mb-3">
      <h5 className="px-3 pt-3 text-white">{title}</h5>
      <Nav className="flex-column">
        {options.map((option, index) => (
          <Nav.Link key={index} href={option.href} className="text-white-50">
            {option.name}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
}

export default SidebarSection;
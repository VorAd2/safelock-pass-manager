import { Col } from 'react-bootstrap';
import ArrowRightIcon from '../../assets/features/arrow-right.svg?react';

const FeatureCol = ({ icon: IconComponent, title, description, linkText, linkHref }) => {
  return (
    <Col className='feature'>
      <div className='feature-icon-back'>
        {IconComponent && <IconComponent style={{ fill: 'white' }} className='feature-icon' />}
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
      <a href={linkHref}>{linkText} <ArrowRightIcon /></a>
    </Col>
  );
};

export default FeatureCol;
import { Col } from 'react-bootstrap';
import ArrowRightIcon from '../../../assets/features/arrow-right.svg?react';
import styles from '../../../styles/HomePage.module.css';

const FeatureCol = ({ icon: IconComponent, title, description, linkText, linkHref }) => {
  return (
    <Col className={styles.feature}>
      <div className={styles.featureIconBack}>
        {IconComponent && <IconComponent style={{ fill: 'white' }} className={styles.featureIcon}/>}
      </div>
      <h3 style={{fontSize:'1.8rem'}}>{title}</h3>
      <p className='mt-3'>{description}</p>
      <a href={linkHref}>{linkText} <ArrowRightIcon /></a>
    </Col>
  );
};

export default FeatureCol;
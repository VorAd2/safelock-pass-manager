import { Col } from 'react-bootstrap';
import { ArrowRightIcon1 } from '../../../assets/features';
import styles from '../../../styles/HomePage.module.css';

const FeatureCol = ({ icon: IconComponent, title, description }) => {
  return (
    <Col className={styles.feature}>
      <div className={styles.featureIconBack}>
        {IconComponent && <IconComponent style={{ fill: 'white' }} className={styles.featureIcon} />}
      </div>
      <h3 style={{ fontSize: '1.8rem' }}>{title}</h3>
      <p className='mt-3'>{description}</p>
      <p style={{ textDecoration: 'underline', cursor: 'pointer', color: '#0d6efd' }} >Learn more <ArrowRightIcon1 /> </p>
    </Col>
  );
};

export default FeatureCol;
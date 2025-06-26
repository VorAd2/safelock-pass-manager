import { Alert } from 'react-bootstrap';
import styles from '../../styles/Notification.module.css';

const Notification = ({ show, variant, message }) => {
  if (!show) return null;

  return (
    <div className={styles.notificationWrapper}>
      <Alert variant={variant} className="mb-0 text-center">
        {message}
      </Alert>
    </div>
  );
};

export default Notification;

import { useEffect, useState} from 'react';
import styles from '../../styles/HomePage.module.css';

export default function ScrollTopBtn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
        className={styles.scrollTopBtn}
        onClick={scrollToTop}
        style={{
            display: visible ? 'block' : 'none',
        }}
    >
      ↑
    </button>
  );
}
import { useState } from 'react';
import { CheckIcon } from '../../assets/dashboard'
import styles from '../../styles/CustomCheckBox.module.css';

const CustomCheckbox = ({ label, defaultChecked = false, onChange, onClick }) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleToggle = () => {
    setChecked(prev => {
      const newValue = !prev;
      onChange?.(newValue);
      return newValue;
    });
  };

  return (
    <label className={styles.checkboxContainer} onClick={onClick} >
      <input
        type="checkbox"
        className={styles.hiddenCheckbox}
        checked={checked}
        onChange={handleToggle}
      />
      <span className={`${styles.customCheckbox} ${checked ? styles.checked : styles.unChecked}`}>
        {checked && <span className={styles.checkmark}> <CheckIcon/> </span>}
      </span>
      {label && <span className='fs-5' >{label}</span>}
    </label>
  );
};

export default CustomCheckbox;
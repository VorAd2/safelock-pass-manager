import { useState } from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import styles from '../../../../styles/GeneratorContent.module.css';

function SegmentedPill({ setType }) {
  const [selected, setSelected] = useState("1")

  const options = [
    { name: "Password", value: "1" },
    { name: "Secret Phrase", value: "2" },
    { name: "Username", value: "3" },
  ];

  return (
    <div className={`${styles.segmentedPillContainer} px-4 mt-4 mb-3`}>
      <ButtonGroup className={styles.segmentedPill}>
        {options.map((option, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            variant="outline-primary"
            name="radio"
            value={option.value}
            checked={selected === option.value}
            onChange={(e) => { setSelected(e.currentTarget.value); setType(option.name) }}
            className={styles.pillBtn}
          >
            {option.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </div>
  )
}

export default SegmentedPill

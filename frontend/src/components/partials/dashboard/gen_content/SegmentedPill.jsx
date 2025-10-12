import { useState } from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import styles from '../../../../styles/GeneratorContent.module.css';

function SegmentedPill({ handleTypeChange }) {
  const [selected, setSelected] = useState("1")

  const options = [
    { name: "Password", value: "1" },
    { name: "Secret Phrase", value: "2" },
    { name: "Username", value: "3" },
  ]

  return (
    <fieldset
      className={`${styles.segmentedPillContainer} px-4 mt-4 mb-3`}
      aria-label="Generation Type"
    >
      <legend className="visually-hidden">Choose the generator type</legend>
      <ButtonGroup role="radiogroup" aria-label="Generator Type" className={styles.segmentedPill}>
        {options.map((option, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            variant="outline-primary"
            name="generator-type"
            value={option.value}
            checked={selected === option.value}
            aria-checked={selected === option.value}
            onChange={(e) => {
              setSelected(e.currentTarget.value);
              handleTypeChange(option.name);
            }}
            className={styles.pillBtn}
          >
            {option.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </fieldset>
  )
}

export default SegmentedPill

import { useState } from "react";
import { Form } from "react-bootstrap";
import { InfoOutline } from "../../../../assets/shared";
import styles from "../../../../styles/GeneratorContent.module.css";

export default function StrengthSlider({ setStrength }) {
    const [value, setValue] = useState(0)

    const labels = ["Weak", "Medium", "Strong", "Very Strong"]
    const colors = ["#28a745", "#a78428", "#a74528", "#5936caff"]
    const percent = (value / 3) * 100

    return (
        <div style={{ width: "45%" }} className="ms-4 mt-4">
            <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Range
                    min={0}
                    max={3}
                    step={1}
                    value={value}
                    onChange={(e) => { setValue(Number(e.target.value)); setStrength(labels[Number(e.target.value)]) }}
                    className={styles.slider}
                    style={{
                        "--slider-color": colors[value],
                        "--percent": `${percent}%`,
                    }}
                />

                <InfoOutline
                    style={{ marginLeft: "15px", cursor: "pointer", fill: "white" }}
                    onClick={() => alert("Info sobre o nível de senha")}
                />
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                }}
            >
                {labels.map((label, idx) => (
                    <span
                        key={idx}
                        style={{
                            fontSize: "0.85rem",
                            color: idx === value ? colors[value] : "#666",
                            fontWeight: idx === value ? "bold" : "normal",
                        }}
                    >
                        {label}
                    </span>
                ))}
            </div>
        </div>
    )
}

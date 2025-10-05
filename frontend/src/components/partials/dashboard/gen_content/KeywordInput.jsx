import { useState } from "react";
import { XIcon } from "../../../../assets/shared";
import styles from "../../../../styles/GeneratorContent.module.css";

export default function KeywordInput({ contextWordsRef }) {
    const [tags, setTags] = useState([])
    const [inputValue, setInputValue] = useState("")

    const handleKeyDown = (e) => {
        const newWord = inputValue.trim()
        if (e.key === "Enter" && newWord !== "") {
            e.preventDefault()
            setTags([...tags, newWord])
            contextWordsRef.current.push(newWord)
            setInputValue("")
        }
    }

    const removeTag = (index) => {
        setTags(tags.filter((_, i) => i !== index))
    }

    return (
        <div className="px-4" style={{ width: '45%' }}>
            <div className={styles.tagInputWrapper}>
                {tags.map((tag, index) => (
                    <span key={index} className={styles.tagBadge}>
                        {tag}
                        <button
                            type="button"
                            className={styles.tagRemove}
                            onClick={() => removeTag(index)}
                        >
                            <XIcon />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    placeholder={tags.length === 3 ? '' : "Type and press Enter"}
                    disabled={tags.length === 3}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    )
}

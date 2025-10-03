import { useState, useCallback } from "react";
import { ENTROPY_PER_WORD, pickRandomWords } from "../lib/wordUtils";

const strengthMap = {
    Weak: 3,
    Medium: 4,
    Strong: 6,
    "Very Strong": 8,
}

export function usePassphrase() {
    const [last, setLast] = useState(null)

    const generate = useCallback((strength, options = {}) => {
        const numWords = strengthMap[strength] ?? strengthMap.Strong
        const words = pickRandomWords(numWords, {
            allowRepeats: options.allowRepeats ?? true,
        })

        let formatted = [...words]
        if (options.capitalizeEach) {
            formatted = formatted.map((w) => w[0].toUpperCase() + w.slice(1))
        } else if (options.capitalizeFirst) {
            formatted[0] = formatted[0][0].toUpperCase() + formatted[0].slice(1)
        }

        const separator = options.separator ?? "-"
        const passphrase = formatted.join(separator)
        const bits = ENTROPY_PER_WORD * numWords

        const result = { passphrase, bits, numWords, strength }
        setLast(result)
        return result
    }, [])

    return { generate, last }
}

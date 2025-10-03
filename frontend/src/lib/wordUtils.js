const wordlist = [
    "apple", "river", "stone", "light", "forest",
    "dream", "cloud", "shadow", "fire", "moon",
    "sky", "sun", "star", "wind", "rain",
    "tree", "leaf", "flower", "mountain", "sea",
    "bird", "wolf", "cat", "dog", "fish",
    "horse", "path", "bridge", "island", "sand",
    "shell", "storm", "snow", "ice", "grass",
    "field", "gold", "silver", "time", "song",
    "music", "voice", "heart", "soul", "mind",
    "dreamer", "runner", "hunter", "friend",
    "lua", "sol", "estrela", "ceu", "vento",
    "chuva", "nuvem", "rio", "mar", "areia",
    "pedra", "floresta", "arvore", "folha", "flor",
    "montanha", "campo", "grama", "fogo", "neve",
    "gelo", "relampago", "raio", "som", "musica",
    "voz", "coracao", "alma", "mente", "amigo",
    "luz", "sombra", "tempo", "historia", "caminho",
    "ponte", "ilha", "passaro", "lobo", "gato",
    "cachorro", "peixe", "cavalo", "ouro", "prata",
    "sonho", "cacador", "viajante", "guardiao", "esperanca"
]

export const ENTROPY_PER_WORD = Math.log2(wordlist.length)

export function secureRandomIndex(max) {
    if (!Number.isInteger(max) || max <= 0) throw new Error("max deve ser inteiro positivo")
    const uint32Max = 0xFFFFFFFF
    const threshold = (uint32Max + 1) - ((uint32Max + 1) % max)
    const rand = new Uint32Array(1)
    while (true) {
        crypto.getRandomValues(rand)
        const val = rand[0]
        if (val < threshold) return val % max
    }
}

export function pickRandomWords(count = 4, { allowRepeats = true } = {}) {
    const out = []
    const max = wordlist.length
    if (!allowRepeats && count > max) throw new Error("count maior que a wordlist sem permitir repetição")
    const used = new Set()
    while (out.length < count) {
        const idx = secureRandomIndex(max)
        if (!allowRepeats) {
            if (used.has(idx)) continue
            used.add(idx)
        }
        out.push(wordlist[idx])
    }
    return out
}

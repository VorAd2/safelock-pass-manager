const express = require('express');
const router = express.Router();

function genPrompt(contextWords) {
    return `
        Você é um especialista em criar nomes de usuário (usernames) curtos, criativos e únicos para redes sociais.
        Sua tarefa é gerar UM ÚNICO username com base nas palavras-chave fornecidas.

        Siga estas regras OBRIGATORIAMENTE:
        1.  O username deve ter exatamente 6 a 14 caracteres.
        2.  O username deve conter apenas letras minúsculas e, opcionalmente, números.
        3.  O username NÃO PODE conter espaços, caracteres especiais, ou letras maiúsculas.
        4.  O username deve ser criativo e relacionado às palavras-chave.

        Você deve pesquisar as palavras-chave para entender o contexto delas e relacioná-las de
        maneira criativa. Evite simplesmente fazer um rearranjo das letras.

        Agora, gere um username para as seguintes palavras-chave: ${contextWords}
    `
}

module.exports = (gemini) => {
    router.get('/', async (req, res) => {
        const { contextWords } = req.body
        try {
            const response = await gemini.models.generateContent({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'Retorne apenas o username, nada mais',
                    temperature: 2
                },
                contents: genPrompt(contextWords)
            })
            return res.status(200).json({ output: response.text.trim() })
        } catch (err) {
            if (err.httpStatus === 429) {
                return res.status(429).json({ message: 'Generation limit reached. Please wait a few minutes and try again.' })
            }
            console.log(`Erro inesperado na consulta ao gemini: ${err}`)
            return res.status(500).send()
        }
    })
    return router
}
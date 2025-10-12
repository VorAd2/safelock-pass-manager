import { useState, useRef, useEffect } from 'react'
import { usePassphrase } from '../../../../hooks/usePassphrase.js'
import { Spinner } from 'react-bootstrap'
import { SegmentedPill, StrengthSlider, KeywordInput } from '../../../index.js'
import styles from '../../../../styles/GeneratorContent.module.css'
import styled from 'styled-components'
import { CopyIcon, RefreshIcon2, InfoOutline } from '../../../../assets/shared/index.js'
import { useNavigate, useOutletContext } from 'react-router-dom'
import backCodes from '../../../../back_codes.js'
import generatorService from '../../../../services/generatorService.js'

const TextButton = styled.button`
        background: none;
        border: none;
        color: #007bff;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        &:hover {
            text-decoration: underline;
        }
        &:focus {
            outline: none;
        }
    
    `

const GeneratorContent = () => {
    const [product, setProduct] = useState()
    const contextWordsRef = useRef([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [type, setType] = useState('Password')
    const typeRef = useRef(type)
    const [strength, setStrength] = useState('Weak')
    const { generate } = usePassphrase()
    const { username } = useOutletContext()
    const navigate = useNavigate()

    const separator = '-'
    const capitalizeEach = false
    const allowRepeats = false

    useEffect(() => {
        typeRef.current = type
    }, [type])

    function generatePassword() {
        const lowercase = "abcdefghijklmnopqrstuvwxyz"
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const numbers = "0123456789"
        const symbols = "!@#$%^&*()_+-=[]{};:,.<>/?"
        let charset = ""
        let length = 12
        switch (strength) {
            case 'Weak':
                charset = lowercase + numbers
                length = 8
                break

            case 'Medium':
                charset = lowercase + uppercase + numbers
                length = 12
                break

            case 'Strong':
                charset = lowercase + uppercase + numbers + symbols
                length = 16
                break

            case 'Very Strong':
                charset = lowercase + uppercase + numbers + symbols
                length = 20
                break

            default:
                throw new Error('Nível de força inválido. Use: fraca, media, forte, muito forte.')
        }
        const array = new Uint32Array(length)
        crypto.getRandomValues(array)
        let password = ""
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length]
        }
        return password
    }

    function generatePhrase() {
        try {
            const result = generate(strength, { separator, capitalizeEach, allowRepeats })
            return result.passphrase
        } catch (err) {
            alert("Erro: " + err.message)
        }
    }

    async function handleUsernameGen() {
        const authToken = localStorage.getItem("authToken")
        if (!authToken) {
            alert('No token found. Redirecting...')
            navigate("/signin")
            return
        }
        setIsGenerating(true)
        try {
            const params = {
                ownerUser: username,
                contextWords: JSON.stringify(contextWordsRef.current)
            }
            const response = await generatorService.genUsername(authToken, params)
            if (typeRef.current === 'Username') {
                setProduct(response.data.output)
            }
        } catch (err) {
            if (err.response) {
                const status = err.response.status
                const code = err.response.data?.code
                const message = err.response.data?.message
                if ([400, 429].includes(status)) {
                    alert(message)
                } else if (code === backCodes.ACCESS_DENIED) {
                    alert(message)
                    localStorage.removeItem('authToken')
                    console.log('entrou')
                    navigate('/signin')
                } else {
                    alert(backCodes.GENERIC_ERROR_FEEDBACK)
                    console.warn('Erro na presença de response:', err.response)
                }
            } else if (err.request) {
                alert(backCodes.RESPONSE_ERROR_FEEDBACK)
                console.warn('Erro na presença de request:', err.request)
            } else {
                alert(backCodes.GENERIC_ERROR_FEEDBACK)
                console.warn('Erro inesperado:', err.message)
            }
        } finally {
            setIsGenerating(false)
        }
    }

    const handleRefresh = () => {
        switch (type) {
            case 'Password':
                setProduct(generatePassword())
                break
            case 'Secret Phrase': {
                setProduct(generatePhrase())
                break
            }
            case 'Username':
                if (isGenerating) return
                handleUsernameGen()
                break
            default:
                throw new Error('Invalid generator type')
        }
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(product)
        } catch (err) {
            alert(`Error copying field: ${err.message}`)
        }
    }

    function getSpinner() {
        return (
            <span className='text-secondary'>
                <Spinner className='me-4' as='span' variant='secondary' animation='border' role='status' />
                Consulting Google Gemini...
            </span>
        )
    }

    function getProductStage() {
        return (
            <section className="d-flex flex-column mt-5 px-4">
                <div className="d-flex flex-column align-items-start" style={{ width: "45%" }}>
                    <div className="d-flex align-items-center w-100 fs-5 text-white">
                        <output aria-live='polite'>
                            {isGenerating && type === 'Username'
                                ? getSpinner()
                                : product
                            }
                        </output>
                        <div className="d-flex justify-content-center align-items-center ms-auto">
                            <button
                                title='Refresh'
                                type="button"
                                className={`${styles.stageButton} d-flex justify-content-center align-items-center p-2 me-2`}
                                onClick={handleRefresh}
                            >
                                <RefreshIcon2 />
                            </button>
                            <button
                                title='Copy'
                                type="button"
                                className={`${styles.stageButton} d-flex justify-content-center align-items-center p-2`}
                                onClick={handleCopy}
                            >
                                <CopyIcon style={{ width: "20px", height: "20px" }} />
                            </button>
                        </div>
                    </div>
                    <hr className={styles.stageLine} style={{ width: "100%" }} />
                </div>
            </section>
        )
    }

    const handleTypeChange = (type) => {
        setProduct()
        contextWordsRef.current = []
        setType(type)
    }

    function getSubComponent() {
        switch (type) {
            case 'Password':
            case 'Secret Phrase':
                return <StrengthSlider setStrength={setStrength} />
            case 'Username':
                return <KeywordInput contextWordsRef={contextWordsRef} />
        }
    }

    return (
        <div className='d-flex flex-column'>
            <SegmentedPill handleTypeChange={handleTypeChange} />
            {getProductStage()}
            <section className='d-flex flex-column'>
                <header className='d-flex align-items-center px-4 mt-4 mb-2'>
                    <h2 className='text-white fs-4' style={{ margin: 0 }}>{type}</h2>
                    <button
                        type='button'
                        aria-label={`Info about ${type}`}
                        className='ms-3 bg-transparent border-0'
                        onClick={() => alert('Not implemented')}
                    >
                        <InfoOutline style={{ fill: 'white', cursor: 'pointer' }} />
                    </button>
                </header>
                {getSubComponent()}
            </section>
            <div className='px-4 mt-5'>
                <TextButton onClick={() => alert('Not implemented')}>Generator History</TextButton>
            </div>
        </div>
    )

}

export default GeneratorContent
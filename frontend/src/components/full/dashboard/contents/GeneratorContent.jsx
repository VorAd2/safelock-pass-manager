import { useState } from 'react'
import { usePassphrase } from '../../../../hooks/usePassphrase.js'
import { SegmentedPill, StrengthSlider, KeywordInput } from '../../../index.js'
import styles from '../../../../styles/GeneratorContent.module.css'
import styled from 'styled-components'
import { CopyIcon, RefreshIcon2, InfoOutline } from '../../../../assets/shared/index.js'

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
    const [type, setType] = useState('Password')
    const [strength, setStrength] = useState('Weak')
    const { generate } = usePassphrase()

    const separator = '-'
    const capitalizeEach = false
    const allowRepeats = false

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
                console.log('Username')
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

    function getProductStage() {
        return (
            <div className="d-flex flex-column mt-5 px-4">
                <div className="d-flex flex-column align-items-start" style={{ width: "45%" }}>
                    <div className="d-flex align-items-center w-100 fs-5 text-white">
                        <span>{product}</span>
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
            </div>
        );
    }

    const handleTypeChange = (type) => {
        setProduct()
        setType(type)
    }

    switch (type) {
        case 'Password':
            return (
                <div className='d-flex flex-column'>
                    <SegmentedPill handleTypeChange={handleTypeChange} />
                    {getProductStage()}
                    <div className='d-flex align-items-center px-4 mt-4 mb-2'>
                        <h2 className='text-white fs-4' style={{ margin: 0 }}>Password Strength</h2>
                        <InfoOutline
                            style={{ marginLeft: "15px", cursor: "pointer", fill: "white" }}
                            onClick={() => alert("Info sobre o nível de senha")}
                        />
                    </div>
                    <StrengthSlider setStrength={setStrength} />
                    <div className='px-4 mt-5'>
                        <TextButton>Generator History</TextButton>
                    </div>
                </div>
            )
        case 'Secret Phrase':
            return (
                <div className='d-flex flex-column'>
                    <SegmentedPill handleTypeChange={handleTypeChange} />
                    {getProductStage()}
                    <div className='d-flex align-items-center px-4 mt-4 mb-2'>
                        <h2 className='text-white fs-4' style={{ margin: 0 }}>Phrase Strength</h2>
                        <InfoOutline
                            style={{ marginLeft: "15px", cursor: "pointer", fill: "white" }}
                            onClick={() => alert("Info sobre o nível de senha")}
                        />
                    </div>
                    <StrengthSlider setStrength={setStrength} />
                    <div className='px-4 mt-5'>
                        <TextButton>Generator History</TextButton>
                    </div>
                </div>
            )
        case 'Username':
            return (
                <div className='d-flex flex-column'>
                    <SegmentedPill handleTypeChange={handleTypeChange} />
                    {getProductStage()}
                    <div className='d-flex align-items-center px-4 mt-4 mb-3'>
                        <h2 className='text-white fs-4' style={{ margin: 0 }}>Keywords</h2>
                        <InfoOutline
                            style={{ marginLeft: "15px", cursor: "pointer", fill: "white" }}
                            onClick={() => alert("Info sobre o nível de senha")}
                        />
                    </div>
                    <KeywordInput />
                    <div className='px-4 mt-5'>
                        <TextButton>Generator History</TextButton>
                    </div>
                </div>
            )
    }
}

export default GeneratorContent
import { useRef, useState, useEffect } from "react"
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap'

const VaultPinModal = ({ onHide, pin }) => {
    const [inputValue, setInputValue] = useState('')
    const [errFeedback, setErrFeedback] = useState('')
    const buttonRefs = useRef({})

    const handleButtonClick = (value) => {
        if (value === '⌫') {
            setInputValue((prev) => prev.slice(0, -1))
        } else if (inputValue.length < 5) {
            setInputValue((prev) => prev + value)
        }
    }

    const handleKeyDown = (event) => {
        const { key } = event
        if (/^[0-9]$/.test(key)) {
            if (buttonRefs.current[key]) {
                event.preventDefault()
                buttonRefs.current[key].click()
            }
        } else if (key === 'Backspace') {
            event.preventDefault()
            setInputValue((prev) => prev.slice(0, -1))
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const renderKeypad = () => {
        const numbers = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['', '0', '⌫'],
        ]
        return numbers.map((row, rowIndex) => (
            <Row key={rowIndex} className="mb-2">
                {row.map((num) => (
                    <Col key={num}>
                        {num && (
                        <Button
                            ref={(el) => (buttonRefs.current[num] = el)}
                            variant="outline-secondary"
                            size="lg"
                            onClick={() => handleButtonClick(num)}
                            className="w-100"
                        >
                            {num}
                        </Button>
                        )}
                    </Col>
                ))}
            </Row>
        ))
    }

    const handleOpen = () => {
            setErrFeedback('')
        if (inputValue === pin) {
            onHide(true)
        } else {
            setErrFeedback('Incorrect PIN.')
        }
    }

    return (
        <Modal show={true} onHide={() => onHide(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>PIN de Abertura</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="PIN"
                value={inputValue}
                onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, '')
                    if (onlyNums.length <= 5) {
                    setInputValue(onlyNums)
                    }
                }}
                className="mb-1 text-center no-spinners"
                isInvalid={!!errFeedback}
                required
                />
                <Form.Control.Feedback type="invalid">{errFeedback}</Form.Control.Feedback>
                <Container className="mt-3">{renderKeypad()}</Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onHide(false)}>
                    Cancelar
                </Button>
                <Button disabled={inputValue.length < 5} variant="primary" onClick={handleOpen}>
                    Abrir
                </Button>
            </Modal.Footer>
        </Modal>
  )
}

export default VaultPinModal

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Modal, Form } from "react-bootstrap"
import styles from '../../../../../styles/VaultModal.module.css'
import backCodes from "../../../../../back_codes"

import { useVaults } from "../../../../context/useVaults"
import vaultService from "../../../../../services/vaultService"

const VaultTitleChangeModal = ({ data, onHide }) => {
    const [newTitle, setNewTitle] = useState(data.title)
    const [errorMsg, setErrorMsg] = useState('')
    const inputRef = useRef(null)
    const navigate = useNavigate()
    const { changeVaultTitle } = useVaults()

    useEffect(() => {
        const formControl = inputRef.current
        if (formControl) {
            formControl.focus()
            formControl.select()
        }
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg()
        const authToken = localStorage.getItem("authToken")
        if (!authToken) {
            alert("No token found. Redirecting to signin.")
            navigate("/signin")
            return
        }
        try {
            const body = { ownerUsername: data.ownerUser, vaultId: data._id, newTitle: newTitle }
            await vaultService.changeVaultTitle(authToken, body)
            changeVaultTitle(data._id, newTitle)
            handleClose(true)
        } catch (err) {
            if (err.response) {
                const code = err.response.data?.code
                const message = err.response.data?.message
                if (code === backCodes.ACCESS_DENIED) {
                    alert(message)
                    localStorage.removeItem('authToken')
                    navigate('/signin')
                } else if (code === backCodes.DUPLICATE_VAULT) {
                    setErrorMsg(message)
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
        }
    }

    const handleClose = (changed = false) => {
        setNewTitle()
        setErrorMsg()
        onHide(changed)
    }

    return (
        <Modal show={true} onHide={handleClose} centered>
            <Modal.Header>
                <Modal.Title>
                    <span>Change Your Vault Name</span>
                    <span className="ms-3">
                        [<span className="p-1" style={{ color: 'var(--lessdark-blue-color)' }}>{data?.title}</span>]
                    </span>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="changeVaultTitle" onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label className="fs-5">New Title</Form.Label>
                        <Form.Control
                            ref={inputRef}
                            type="text"
                            onChange={(e) => setNewTitle(e.target.value)}
                            isInvalid={!!errorMsg}
                            value={newTitle}
                            required
                            autoFocus />
                        <Form.Control.Feedback type="invalid">{errorMsg}</Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                <button
                    type="submit"
                    form="changeVaultTitle"
                    className={styles.confirmCredentialModalBtn}
                    disabled={newTitle === data.title}
                >
                    Change
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default VaultTitleChangeModal
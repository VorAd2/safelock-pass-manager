/* eslint-disable no-unused-vars */
import { Modal, Form } from "react-bootstrap"
import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { useVaults } from "../../../../context/useVaults"
import styles from '../../../../../styles/VaultModal.module.css'

const BACK_URL = import.meta.env.VIITE_BACKEND_URL

function SendVaultModal({ show, setSendModalVisible, vaultData, username }) {
    const [recipientUsername, setRecipientUsername] = useState('')
    const vaultTitle = vaultData.title
    const vaultId = vaultData._id
    const originUser = vaultData.originUser
    const { setSharing } = useVaults()
    const navigate = useNavigate();

    const resetForm = () => {
        setRecipientUsername('')
    }

    const handleClose = () => {
        resetForm()
        setSendModalVisible(false)
    }

    const handleSubmit = async () => {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            console.warn("No token found. Redirecting to signin.");
            navigate("/signin");
            return;
        }
        const reqBody = {
            originUsername: originUser,
            senderUsername: username,
            recipientUsername: recipientUsername,
            vaultId
        }
        try {
            const response = await axios.patch(`${BACK_URL}/dashboard/vaults/sharing`,
                reqBody,
                { headers: { Authorization: `Bearer ${authToken}` }}
            )
            setSharing(vaultTitle, recipientUsername)
        } catch (err) {
            console.log(`Erro ao compartilhar vault: ${err}`)
        } finally {
            handleClose()
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header>
                <Modal.Title>Share Your Vault • {vaultData.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="sendVault" onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label className="fs-5">Recipient e-mail</Form.Label>
                        <Form.Control 
                        type="text"
                        value={recipientUsername}
                        placeholder="Type the name of the recipient user"
                        onChange={(e) => setRecipientUsername(e.target.value)}
                        required
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                <button
                type="submit"
                form="sendVault"
                className={styles.confirmCredentialModalBtn}
                >
                    Send
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default SendVaultModal
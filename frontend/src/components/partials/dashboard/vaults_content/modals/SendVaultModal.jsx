import { Modal, Form } from "react-bootstrap"
import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { useVaults } from "../../../../context/useVaults"
import styles from '../../../../../styles/VaultModal.module.css'

const BACK_URL = import.meta.env.VITE_BACKEND_URL

function SendVaultModal({ show, setSendModalVisible, vaultData, username, notificationHandler }) {
    const [recipientUsername, setRecipientUsername] = useState('')
    const [errMsg, setErrMsg] = useState('')
    vaultData = vaultData ?? {title: '', vaultId: '', ownerUser: ''}
    const vaultTitle = vaultData.title
    const vaultId = vaultData._id
    const ownerUser = vaultData.ownerUser
    const { setSharing } = useVaults()
    const navigate = useNavigate();

    const resetForm = () => {
        setRecipientUsername('')
    }

    const handleClose = () => {
        resetForm()
        setErrMsg('')
        setSendModalVisible(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrMsg('')
        if (recipientUsername === username) {
            setErrMsg("You can't share a vault with yourself")
            return
        }
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            console.warn("No token found. Redirecting to signin.");
            navigate("/signin");
            return;
        }
        const reqBody = {
            ownerUsername: ownerUser,
            senderUsername: username,
            recipientUsername: recipientUsername,
            vaultId
        }
        try {
            await axios.patch(`${BACK_URL}/dashboard/vaults/sharing`,
                reqBody,
                { headers: { Authorization: `Bearer ${authToken}` }}
            )
            setSharing(vaultTitle, recipientUsername)
            handleClose()
            notificationHandler(true, 'Vault shared successfully', 'success')
        } catch (err) {
            console.warn(`Erro ao compartilhar vault: ${err}`)
            if (err.response && err.response.status === 404) {
                console.log(`Erro message: ${err.response.data.message}`)
                setErrMsg(err.response.data.message)
            } else {
                setErrMsg('Erro inesperado ao compartilhar vault')
            }
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header>
                <Modal.Title>
                    <span>Share Your Vault</span> 
                    <span className="ms-3">
                        [<span className="p-1" style={{color:'var(--lessdark-blue-color)'}}>{vaultData.title}</span>]
                    </span> 
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="sendVault" onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label className="fs-5">Recipient Username</Form.Label>
                        <Form.Control 
                        type="text"
                        value={recipientUsername}
                        placeholder="Type the name of the recipient user"
                        onChange={(e) => setRecipientUsername(e.target.value)}
                        required
                        />
                        {errMsg && ( <Form.Text className="text-danger">{errMsg}</Form.Text> )}
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
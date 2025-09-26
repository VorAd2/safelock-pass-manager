import { useNavigate } from "react-router-dom"
import { useVaults } from "../../../../context/useVaults"
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'; 
import { Modal, Form } from "react-bootstrap"
import { useState } from "react"
import styles from '../../../../../styles/VaultModal.module.css'
import backCodes from "../../../../../back_codes"
const BACK_URL = import.meta.env.VITE_BACKEND_URL


function SendVaultModal({ vaultData, notificationHandler, fromVaultInfo, onHide }) {
    const username = jwtDecode(localStorage.getItem('authToken')).userData.username
    const [recipientUsername, setRecipientUsername] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const vaultTitle = vaultData?.title
    const vaultId = vaultData?._id
    const ownerUser = vaultData?.ownerUser
    const { setSharing } = useVaults()
    const navigate = useNavigate();

    const resetForm = () => {
        setRecipientUsername('')
    }

    const handleClose = () => {
        resetForm()
        setErrMsg('')
        onHide(fromVaultInfo)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrMsg()
        if (recipientUsername === username) {
            setErrMsg("You can't share a vault with yourself")
            return
        }
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            alert("No token found. Redirecting to signin...");
            navigate("/signin");
            return;
        }
        const reqBody = {
            ownerUsername: ownerUser,
            senderUsername: username,
            recipientUsername: recipientUsername,
            vaultId,
            vaultTitle
        }
        try {
            await axios.patch(`${BACK_URL}/dashboard/vaults/sharing`,
                reqBody,
                { headers: { Authorization: `Bearer ${authToken}` }}
            )
            setSharing(vaultId, recipientUsername)
            handleClose()
            notificationHandler(true, 'Vault shared successfully', 'success')
        } catch (err) {
            if (err.response) {
                const code = err.response.data?.code
                const message = err.response.data?.message
                const potentialCodes = [backCodes.NOT_ALLOWED, backCodes.RECIPIENT_NOT_FOUND, backCodes.RECIPIENT_ALREADY]
                if (code === backCodes.ACCESS_DENIED) {
                    alert(message)
                    localStorage.removeItem('authToken')
                    navigate('/signin')
                } else if (potentialCodes.includes(code)) {
                    setErrMsg(message)
                } else {
                    alert(backCodes.GENERIC_ERROR_FEEDBACK)
                    console.warn(`Erro na presença de response: ${err}`)
                }
            } else if (err.request) {
                alert(backCodes.RESPONSE_ERROR_FEEDBACK)
                console.warn('Erro na presença de request:', err.request)
            } else {
                alert(backCodes.GENERIC_ERROR_FEEDBACK)
                console.warn(`Erro: ${err}`)
            }
            
        }
    }

    return (
        <Modal show={true} onHide={handleClose} centered>
            <Modal.Header>
                <Modal.Title>
                    <span>Share Your Vault</span> 
                    <span className="ms-3">
                        [<span className="p-1" style={{color:'var(--lessdark-blue-color)'}}>{vaultData?.title}</span>]
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
                        isInvalid={!!errMsg}
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
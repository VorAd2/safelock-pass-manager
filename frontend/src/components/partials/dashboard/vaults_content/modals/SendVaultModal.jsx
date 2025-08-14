import { useNavigate } from "react-router-dom"
import { useVaults } from "../../../../context/useVaults"
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'; 
import { Modal, Form } from "react-bootstrap"
import { useState, useEffect } from "react"
import styles from '../../../../../styles/VaultModal.module.css'
import backCodes from "../../../../../back_codes"

const BACK_URL = import.meta.env.VITE_BACKEND_URL


function SendVaultModal({ vaultData, notificationHandler, visibleState, onHide }) {
    const username = jwtDecode(localStorage.getItem('authToken')).userData.username
    const [recipientUsername, setRecipientUsername] = useState('')
    const [errMsg, setErrMsg] = useState('')
    vaultData = vaultData ?? {title: '', vaultId: '', ownerUser: ''}
    const vaultTitle = vaultData.title
    const vaultId = vaultData._id
    const ownerUser = vaultData.ownerUser
    const { setSharing } = useVaults()
    const navigate = useNavigate();


    useEffect(() => {
        return () => {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop?.parentNode) {
              backdrop.parentNode.removeChild(backdrop);
            }
            document.body.classList.remove('modal-open');
          };
        }, [])

    const resetForm = () => {
        setRecipientUsername('')
    }

    const handleClose = () => {
        resetForm()
        setErrMsg('')
        onHide(visibleState.fromVaultInfo)

        setTimeout(() => {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop?.parentNode) {
                backdrop.parentNode.removeChild(backdrop);
            }
            if (document.body.classList.contains('modal-open')) {
                document.body.classList.remove('modal-open');
            }
        }, 100);
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
            console.warn(`Erro ao compartilhar vault: ${err}`)
            console.log(`Erro message: ${err.response.data.message}`)
            if (err.response && err.response.data.code === backCodes.ACCESS_DENIED) {
                alert('Access denied or session expired. Please, log in again.')
                navigate('/signin')
            }
            else if (err.response && err.response.data.code === backCodes.RECIPIENT_NOT_FOUND) {
                setErrMsg(err.response.data.message)
            } 
            else if (err.response && err.response.data.code === backCodes.RECIPIENT_ALREADY) {
                setErrMsg('Recipient user already has this vault')
            }
            else {
                setErrMsg('Unknown error. Please, try again')
                console.warn(`Erro message: ${err.response.data.message}`)
            }
        }
    }

    return (
        <Modal show={visibleState.show} onHide={handleClose} centered>
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
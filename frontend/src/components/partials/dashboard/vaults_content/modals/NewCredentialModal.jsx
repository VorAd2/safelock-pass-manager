import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import backCodes from '../../../../../back_codes';
import {Modal, Form} from 'react-bootstrap';
import { EyeIcon, EyeSlashIcon } from '../../../../../assets/dashboard';
import styles from '../../../../../styles/VaultModal.module.css';

import { useVaults } from '../../../../context/useVaults';
const backUrl = import.meta.env.VITE_BACKEND_URL;


const NewCredentialModal = ({ vaultId, vaultTitle, onHide }) => {
    const credentialOwner = jwtDecode(localStorage.getItem('authToken')).userData.username
    const [credentialTitle, setTitle] = useState('')
    const [errFeedback, setErrFeedback] = useState('')
    const [credentialEmail, setEmail] = useState('')
    const [credentialUsername, setUsername] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [credentialPassword, setPassword] = useState('')
    const [credentialLinks, setLinks] = useState([])

    const { addCredential } = useVaults()
    const navigate = useNavigate()

    const resetForm = () => {
        setTitle('')
        setEmail('')
        setUsername('')
        setPassword('')
        setLinks([])
        setShowPassword(false)
    }

    const handleClose = (added = false) => {
        resetForm()
        onHide(added)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrFeedback()
        const newCredential = {
            vaultId, vaultTitle, credentialTitle, credentialOwner, credentialEmail, 
            credentialUsername, credentialPassword, credentialLinks 
        }
        const authToken = localStorage.getItem("authToken")
        if (!authToken) {
            alert('No token found. Redirecting to signin...')
            navigate('/signin')
            return
        }
        try {
            const response = await axios.post(`${backUrl}/dashboard/vaults/credentials`, 
                newCredential, 
                { headers: { Authorization: `Bearer ${authToken}` }}
            )
            addCredential(vaultId, response.data)
            handleClose(true)
        } catch (err) {
            if (err.response) {
                const code = err.response.data?.code
                const message = err.response.data.message
                if (code === backCodes.ACCESS_DENIED) {
                    alert(message)
                    localStorage.removeItem('authToken')
                    navigate('/signin')
                } else if (code === backCodes.VAULT_NOT_FOUND) {
                    alert(message)
                } else if (code === backCodes.DUPLICATE_CREDENTIAL) {
                    setErrFeedback(message)
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

    
    return (
        <Modal show={true} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title className='fs-3'>Add Credential</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id='newCredential' onSubmit={handleSubmit}>
                <Form.Group className='mb-1'>
                    <Form.Label className='fs-5' >Title <span className='text-danger'>*</span> </Form.Label>
                    <Form.Control 
                        type="text"
                        value={credentialTitle}
                        onChange={(e) => setTitle(e.target.value)}
                        isInvalid={!!errFeedback}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>{errFeedback}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='mb-1'>
                    <Form.Label className='fs-5'>Email <span className='text-danger'>*</span> </Form.Label>
                    <Form.Control 
                        type="email"
                        value={credentialEmail}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label className='fs-5'>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={credentialUsername}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label className='fs-5'>Password <span className='text-danger'>*</span> </Form.Label>
                    <div className="d-flex align-items-center border rounded pe-2">
                        <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            value={credentialPassword}
                            onChange={(e) => {setPassword(e.target.value)
                            }}
                            className="border-0 shadow-none flex-grow-1"
                            style={{ outline: 'none' }}
                        />
                        <span
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                            cursor: 'pointer',
                            color: '#666',
                            }}
                        >
                            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                        </span>
                    </div>
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label className='fs-5'>Links</Form.Label>
                    <Form.Control
                        type="text"
                        value={credentialLinks.join(', ')}
                        onChange={(e) => setLinks(e.target.value.split(',').map(link => link.trim()))}
                        placeholder="Add comma-separated links"
                    />
                </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
            <button
              type="submit"
              form="newCredential"
              className={styles.confirmCredentialModalBtn}
              disabled={!credentialTitle || !credentialEmail || !credentialPassword}
            >
                Add
            </button>
          </Modal.Footer>
        </Modal>
    )
}

export default NewCredentialModal;
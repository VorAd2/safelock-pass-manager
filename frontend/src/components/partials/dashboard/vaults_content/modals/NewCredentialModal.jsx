import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Modal, Form} from 'react-bootstrap';
import { EyeIcon, EyeSlashIcon } from '../../../../../assets/dashboard';
import styles from '../../../../../styles/VaultModal.module.css';

import { useVaults } from '../../../../context/useVaults';
const backUrl = import.meta.env.VITE_BACKEND_URL;


const NewCredentialModal = ({ vaultId, vaultTitle, modalVisible, onHide, credentialOwner}) => {
    const [credentialTitle, setTitle] = useState('')
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

    const handleClose = () => {
        resetForm()
        onHide()
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newCredential = {
            vaultId, vaultTitle, credentialTitle, credentialOwner, credentialEmail, 
            credentialUsername, credentialPassword, credentialLinks 
        }
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            console.warn("No token found. Redirecting to signin.");
            navigate("/signin");
            return;
        }
        try {
            const response = await axios.post(`${backUrl}/dashboard/vaults/credentials`, 
                newCredential, 
                { headers: { Authorization: `Bearer ${authToken}` }}
            )
            addCredential(vaultId, response.data);
            handleClose()
        } catch (err) {
            if (err.response && err.response.status === 403) {
                alert("Access denied or session expired. Please log in again.");
                localStorage.removeItem("authToken");
                navigate("/signin");
            } else if (err.response && err.response.status === 404) {
                const msg = err.response.data.message
                if (msg === 'The vault no longer exists') alert(msg);
            } else if (err.response && err.response.status === 409) {
                const msg = err.response.data.message
                if (msg == 'Credential title already in use') alert(msg);
            } else {
                alert("Ocorreu um erro ao carregar os dados do cofre.")
                console.warn(err)
            }
        }
    };

    

    return (
        <Modal show={modalVisible} onHide={handleClose} centered>
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
                        required
                    />
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
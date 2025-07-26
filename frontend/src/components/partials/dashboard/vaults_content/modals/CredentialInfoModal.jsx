import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {Modal, Form} from 'react-bootstrap';
import { EyeIcon, EyeSlashIcon, TrashIcon } from '../../../../../assets/dashboard';
import { CopyIcon } from '../../../../../assets/shared';
import styles from '../../../../../styles/CredentialInfoModal.module.css';

const BACK_URL = import.meta.env.VITE_BACK_URL;
import { useVaults } from '../../../../context/useVaults';


function CredentialInfoModal({credential, modalState, setModalState, username, notificationHandler}) {
    const title = credential && credential.credentialTitle
    const owner = credential && credential.credentialOwner
    const email = credential && credential.credentialEmail
    const password = credential && credential.credentialPassword
    const credUsername = credential && credential.credentialUsername
    const links = credential && (credential.credentialLinks.join(', '))
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const { deleteCredential } = useVaults()

    const canDeleteCredential = owner === username


    function closeModal() {
        setModalState({
            visible: false,
            credential: undefined
        })
    }

    const handleCredentialCopy = async (field) => {
        try {
            await navigator.clipboard.writeText(field)
        } catch (err) {
            alert(`Error copying field: ${err.message}`)
        }
  }

    if (credential == undefined) {
        return null
    }

    const handleDeleteCredential = async (e) => {
        e.stopPropagation()
        try {
            let authToken = localStorage.getItem('authToken')
            if (!authToken) {
                console.warn("No token found. Redirecting to signin.");
                navigate("/signin");
                return;
            }
            const route = `${BACK_URL}/dashboard/vaults/credentials`
            const config = {
                headers: { Authorization: `Bearer ${authToken}` },
                data: {
                vaultId: credential.vaultId,
                credential,
                username
                }
            }
            const response = await axios.delete(route, config)
            deleteCredential(credential.vaultId, credential)
            closeModal()
            notificationHandler(true, response.data.message, 'success')
        } catch (err) {
            if (err.response && err.response.data.status === 403) {
                    const msg = err.response.data.message
                    if (msg === "You can't delete other user's credentials") {
                    alert(msg)
                } else {
                    alert('Unknown error. Please, try again')
                    console.warn(`Erro desconhecido na deleção de credential: ${err}`)
                }
            }
        }
    }

    return (
        <Modal show={modalState.visible} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title className='fs-3 d-flex align-items-center'>
                    <span>{title}</span> 
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={`d-flex justify-content-betweem align-items-center mb-3 ${styles.actionBar}`}>
                    <div
                    role='button'
                    tabIndex={0}
                    onClick={() => handleCredentialCopy(email)}
                    >
                        <CopyIcon/>
                        <span>Copy email</span>
                    </div>
                    <div
                    role='button'
                    tabIndex={0}
                    onClick={() => {handleCredentialCopy(credUsername)}}
                    >
                        <CopyIcon/>
                        <span>Copy username</span>
                    </div>
                    <div
                    role='button'
                    tabIndex={0}
                    onClick={() => handleCredentialCopy(password)}
                    >
                        <CopyIcon/>
                        <span>Copy password</span>
                    </div>
                    {canDeleteCredential && 
                    <div
                    role='button'
                    tabIndex={0}
                    onClick={(e) => {e.stopPropagation(); if(canDeleteCredential) handleDeleteCredential(e) }}
                    >
                        <TrashIcon style={{fill:'red', marginRight:'0px',}}/>
                    </div>
                    }
                    
                </div>
                <Form style={{pointerEvents:'none'}}>
                    <Form.Group>
                        <Form.Label className='fs-5'>Email</Form.Label>
                        <Form.Control
                        type='email'
                        value={email}
                        readOnly
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className='fs-5'>Username</Form.Label>
                        <Form.Control
                        type='text'
                        value={credUsername || ""}
                        readOnly
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className='fs-5'>Password</Form.Label>
                        <div className="d-flex align-items-center border rounded pe-2">
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                className="border-0 shadow-none flex-grow-1"
                                style={{ outline: 'none' }}
                                readOnly
                            />
                            <span
                                onClick={() => setShowPassword((prev) => !prev)}
                                style={{
                                cursor: 'pointer',
                                color: '#666',
                                pointerEvents:'auto'
                                }}
                            >
                                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                            </span>
                        </div>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className='fs-5'>Links</Form.Label>
                        <Form.Control
                        as="textarea"
                        value={links || ""}
                        readOnly
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

        </Modal>
    )
}

export default CredentialInfoModal
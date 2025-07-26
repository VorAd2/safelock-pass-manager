import { useState } from 'react'
import {Modal, Form} from 'react-bootstrap';
import { EyeIcon, EyeSlashIcon, TrashIcon } from '../../../../../assets/dashboard';
import { CopyIcon } from '../../../../../assets/shared';
import styles from '../../../../../styles/CredentialInfoModal.module.css'


function CredentialInfoModal({credential, modalState, setModalState}) {
    const title = credential && credential.credentialTitle
    // eslint-disable-next-line no-unused-vars
    const owner = credential && credential.credentialOwner
    const email = credential && credential.credentialEmail
    const password = credential && credential.credentialPassword
    const username = credential && credential.credentialUsername
    const links = credential && (credential.credentialLinks.join(', '))
    const [showPassword, setShowPassword] = useState(false)

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
                    onClick={() => {handleCredentialCopy(username)}}
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
                    <div
                    role='button'
                    tabIndex={0}
                    >
                        <TrashIcon style={{fill:'red', marginRight:'0px',}}/>
                    </div>
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
                        value={username || ""}
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
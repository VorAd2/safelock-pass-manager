import { jwtDecode } from 'jwt-decode'; 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backCodes from '../../../../../back_codes';
import { Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { QuestionIcon, EyeIcon, EyeSlashIcon } from '../../../../../assets/dashboard';
import styles from '../../../../../styles/NewVaultModal.module.css';

import { useVaults } from '../../../../context/useVaults';
const backUrl = import.meta.env.VITE_BACKEND_URL;


const NewVaultModal = ({ onClose, onCreate }) => {
    const ownerUser = jwtDecode(localStorage.getItem('authToken')).userData.username
    const navigate = useNavigate()
    const { addVault, isDuplicateVault } = useVaults()
    const [title, setTitle] = useState('')
    const [pin, setPin] = useState('')
    const [showPin, setShowPin] = useState(false)
    const [desc, setDescription] = useState('')
    const maxTitleLength = 20;
    const maxDescriptionLength = 100;
    const [titleError, setTitleError] = useState('')

    const handleCreate = async (vaultData) => {
        setTitleError('')
        const { title, pin, desc } = vaultData
        let authToken = localStorage.getItem('authToken')
        if (!authToken) {
            alert('No token found. Redirecting...')
            navigate("/signin")
            return
        }
        if (isDuplicateVault(title, ownerUser)) {
            setTitleError(`You already have a vault with that title`)
            return
        }
        try {
            const body = { newVaultData: { ownerUser, title, pin, desc } }
            const config = { headers: { 'Authorization': `Bearer ${authToken}` } }
            const response = await axios.post(`${backUrl}/dashboard/vaults`, body, config)
            const newVault = response.data.vault
            addVault(newVault)
            await onCreate()
        } catch (err) {
            if (err.response && err.response.data.code === backCodes.ACCESS_DENIED) {
                alert('Access denied or session expired. Please log in again.')
                localStorage.removeItem("authToken")
                navigate("/signin")
            } else if (err.response && err.response.data.code === backCodes.DUPLICATE_VAULT) {
                setTitleError('You already have a vault with that title')
            } else {
                alert('Unknown error. Please, try again')
                console.warn(err)
            }
        }
    };


    return (
        <div className={styles.backdrop}>
        <div className={styles.modalBox}>
            <h5 className='mb-3 fs-3'>Create New Vault</h5>
            <Form id='newVaultForm'>
            <Form.Group className="mb-1">
                <Form.Label className='fs-5'>
                    Title <span className='text-danger'>*</span>
                </Form.Label>
                <Form.Control
                type="text"
                maxLength={maxTitleLength}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                isInvalid={!!titleError} 
                />
                <Form.Control.Feedback type="invalid">
                    {titleError}
                </Form.Control.Feedback>
                <div className="text-end text-muted small">
                {title.length}/{maxTitleLength}
                </div>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label className='fs-5 d-flex align-content-center'>
                    PIN{''}
                    <OverlayTrigger
                        placement="right"
                        overlay={
                            <Tooltip id="pin-tooltip">
                                The PIN is an optional numeric identification used to 
                                protect access to the vault.
                            </Tooltip>
                        }
                    >
                        <span style={{marginLeft:'0.3rem', cursor: 'pointer', alignContent:'center' }}>
                            <QuestionIcon style={{width:'12px', height:'12px'}}/>
                        </span>
                    </OverlayTrigger>
                </Form.Label>

                <div className="d-flex align-items-center border rounded pe-2">
                    <Form.Control
                        type={showPin ? 'text' : 'password'}
                        value={pin}
                        onChange={(e) => {
                            const numeric = e.target.value.replace(/\D/g, '');
                            if (numeric.length <= 5) {
                                setPin(numeric);
                            } 
                        }}
                        className="border-0 shadow-none flex-grow-1"
                        style={{ outline: 'none' }}
                    />
                    <span
                        onClick={() => setShowPin((prev) => !prev)}
                        style={{
                        cursor: 'pointer',
                        color: '#666',
                        }}
                    >
                        {showPin ? <EyeSlashIcon /> : <EyeIcon />}
                    </span>
                </div>

                {pin.length > 0 && (
                    <div
                        className={`text-end small mt-1 ${
                            pin.length < 5 ? 'text-danger' : 'text-success'
                        }`}
                    >
                    {pin.length}/5
                    </div>
                )}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label className='fs-5'>
                    Description <span className='text-danger'>*</span>
                </Form.Label>
                <Form.Control
                as="textarea"
                rows={3}
                maxLength={maxDescriptionLength}
                value={desc}
                onChange={(e) => setDescription(e.target.value)}
                />
                <div className="text-end text-muted small">
                {desc.length}/{maxDescriptionLength}
                </div>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
                <Button type='button' variant="secondary" onClick={onClose}>
                Cancel
                </Button>
                <button
                    type='button'
                    className={styles.confirmModalBtn}
                    onClick={() => handleCreate({title, pin, desc})}
                    disabled={!title || !desc || (pin && pin.length < 5)}
                >
                Create
                </button>
            </div>
            </Form>
        </div>
        </div>
    );
};

export default NewVaultModal;

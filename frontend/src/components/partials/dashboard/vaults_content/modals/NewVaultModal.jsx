import { useState } from 'react';
import { Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { QuestionIcon, EyeIcon, EyeSlashIcon } from '../../../../../assets/dashboard';
import styles from '../../../../../styles/NewVaultModal.module.css';
import { useVaults } from '../../../../context/useVaults';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backUrl = import.meta.env.VITE_BACKEND_URL;

const NewVaultModal = ({ onClose, onCreate, ownerUser }) => {
    const navigate = useNavigate();
    const { addVault } = useVaults();
    
    const [title, setTitle] = useState('');
    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [desc, setDescription] = useState('');
    const maxTitleLength = 20;
    const maxDescriptionLength = 100;

    const handleCreate = async (vaultData) => {
        const { title, pin, desc } = vaultData;
        let authToken = localStorage.getItem('authToken')
        if (!authToken) {
            console.warn("No token found. Redirecting to signin.");
            navigate("/signin");
            return;
        }
        try {
            const response = await axios.post(
                `${backUrl}/dashboard/vaults`,
                { newVaultData: { ownerUser, title, pin, desc } }, // body
                { headers: { 'Authorization': `Bearer ${authToken}` } } // config
            );
            const newVault = response.data.vault;
            addVault(newVault);
            await onCreate();
        } catch (err) {
            if (err.response && err.response.status === 403) {
                alert("Acesso negado ou sessão expirada. Por favor, faça login novamente.");
                localStorage.removeItem("authToken");
                navigate("/signin");
            } else {
                alert("Ocorreu um erro inesperado ao criar o vault.");
                console.warn(err);
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
                />
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

import { useState } from 'react';
import { Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { QuestionIcon, EyeIcon, EyeSlashIcon } from '../../../../assets/dashboard';
import styles from '../../../../styles/NewVaultModal.module.css';
import axios from 'axios';
const backUrl = import.meta.env.VITE_BACKEND_URL;

const NewVaultModal = ({ onClose, onCreate, originUser }) => {
    const [title, setTitle] = useState('');
    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [description, setDescription] = useState('');
    const maxTitleLength = 20;
    const maxDescriptionLength = 100;

    const confirmModal = async (vaultData) => {
        const {title, pin, desc} = vaultData
        try {
            await axios.post(
                `${backUrl}/dashboard/vault`, 
                {originUser, title, pin, desc}
            )
            onCreate(vaultData)
        } catch (err) {
            onClose()
            if (err.response) {
                const errorStatus = err.response.status
                const errorMsg = err.response.data.message
                console.log(`Erro(${errorStatus}) ao criar vault: ${errorMsg}`);
            } else if (err.request) {
                alert('Não foi possível comunicar-se com o servidor. Verifique sua conexão')
            } else {
                alert('Erro ao tentar enviar requisição')
            }
        }
    }

    return (
        <div className={styles.backdrop}>
        <div className={styles.modalBox}>
            <h5 className='mb-3'>Criar Novo Cofre</h5>
            <Form>
            <Form.Group className="mb-1">
                <Form.Label>
                    Título <span className='text-danger'>*</span>
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
                <Form.Label className='d-flex align-content-center'>
                    PIN{''}
                    <OverlayTrigger
                        placement="right"
                        overlay={
                        <Tooltip id="pin-tooltip">
                            O PIN é uma identificação numérica opcional usada para 
                            proteger o acesso ao cofre.
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
                <Form.Label>
                    Descrição <span className='text-danger'>*</span>
                </Form.Label>
                <Form.Control
                as="textarea"
                rows={3}
                maxLength={maxDescriptionLength}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
                <div className="text-end text-muted small">
                {description.length}/{maxDescriptionLength}
                </div>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={onClose}>
                Cancelar
                </Button>
                <button
                className={styles.confirmModalBtn}
                onClick={() => confirmModal({ title, pin, description })}
                disabled={!title || !description}
                >
                Criar
                </button>
            </div>
            </Form>
        </div>
        </div>
    );
};

export default NewVaultModal;

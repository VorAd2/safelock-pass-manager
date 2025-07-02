import { EyeIcon, EyeSlashIcon } from '../../../../../assets/dashboard';
import styles from '../../../../../styles/VaultModal.module.css';
import {Modal, Form} from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVaults } from '../../../../context/useVaults';

const backUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';

const NewCredentialModal = ({ vaultId, modalVisible, setModalVisible, credentialOwner}) => {
    const [credentialTitle, setTitle] = useState('');
    const [credentialEmail, setEmail] = useState('');
    const [credentialUsername, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [credentialPassword, setPassword] = useState('');
    const [credentialLinks, setLinks] = useState([]);

    const { addCredentialByVaultTitle } = useVaults();
    const navigate = useNavigate();

    const resetForm = () => {
        setEmail('');
        setUsername('');
        setPassword('');
        setLinks([]);
        setShowPassword(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newCredential = {
            vaultId, credentialTitle, credentialOwner, credentialEmail, 
            credentialUsername, credentialPassword, credentialLinks 
        }
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            console.warn("Nenhum token encontrado. Redirecionando para login.");
            navigate("/signin");
            return;
        }
        try {
            console.log('Credential a ser inserida:', newCredential);
            const response = await axios.post(`${backUrl}/dashboard/vaults/credentials`, 
                newCredential, 
                { headers: { Authorization: `Bearer ${authToken}` }}
            )
            console.log('Nova credencial postada:', response.data);
            addCredentialByVaultTitle(vaultId, response.data);
        } catch (err) {
            if (err.response && err.response.status === 403) {
                alert("Acesso negado ou sessão expirada. Por favor, faça login novamente.");
                localStorage.removeItem("authToken");
                navigate("/signin");
            } else {
                alert("Ocorreu um erro ao carregar os dados do cofre.");
            }
        }
        resetForm();
        setModalVisible(false);
    };

    const handleClose = () => {
        resetForm();
        setModalVisible(false);
    };

    return (
        <Modal show={modalVisible} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Adicionar Credential</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id='newCredential' onSubmit={handleSubmit}>
                <Form.Group className='mb-1'>
                    <Form.Label>Título <span className='text-danger'>*</span> </Form.Label>
                    <Form.Control 
                        type="text"
                        value={credentialTitle}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-1'>
                    <Form.Label>Email <span className='text-danger'>*</span> </Form.Label>
                    <Form.Control 
                        type="email"
                        value={credentialEmail}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label>Nome de Usuário</Form.Label>
                    <Form.Control
                        type="text"
                        value={credentialUsername}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label>Senha <span className='text-danger'>*</span> </Form.Label>
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
                    <Form.Label>Links</Form.Label>
                    <Form.Control
                        type="text"
                        value={credentialLinks.join(', ')}
                        onChange={(e) => setLinks(e.target.value.split(',').map(link => link.trim()))}
                        placeholder="Adicione links separados por vírgula"
                    />
                </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={handleClose}>Cancelar</button>
            <button
              type="submit"
              form="newCredential"
              className={styles.confirmCredentialModalBtn}
              disabled={!credentialEmail || !credentialPassword}
            >
                Adicionar
            </button>
          </Modal.Footer>
        </Modal>
    )
}

export default NewCredentialModal;
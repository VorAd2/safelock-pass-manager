import { EyeIcon, EyeSlashIcon } from '../../../../../assets/dashboard';
import styles from '../../../../../styles/VaultModal.module.css';
import {Modal, Form} from 'react-bootstrap';
import { useState } from 'react';

const NewCredentialModal = ({modalVisible, setModalVisible, onSubmit, owner}) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [links, setLinks] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, username, owner, password, links });
    };

    return (
        <Modal show={modalVisible} onHide={() => setModalVisible(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Adicionar Credential</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-1'>
                <Form.Label>Email <span className='text-danger'>*</span> </Form.Label>
                <Form.Control 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-1">
                <Form.Label>Nome de Usuário</Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-1">
                <Form.Label>Senha <span className='text-danger'>*</span> </Form.Label>
                <div className="d-flex align-items-center border rounded pe-2">
                    <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        value={password}
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
                    value={links.join(', ')}
                    onChange={(e) => setLinks(e.target.value.split(',').map(link => link.trim()))}
                    placeholder="Adicione links separados por vírgula"
                />
            </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={() => setModalVisible(false)}>Cancelar</button>
            <button
              type="button"
              onClick={() => {}}
              className={styles.confirmCredentialModalBtn}
              disabled={!email || !password}
            >
                Adicionar
            </button>
          </Modal.Footer>
        </Modal>
    )
}

export default NewCredentialModal;
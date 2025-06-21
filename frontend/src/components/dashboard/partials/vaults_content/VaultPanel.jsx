import { Vault } from '../../../index'
import { Container, Row, Col } from 'react-bootstrap';
import { EmptySquareIcon, PlusIcon } from '../../../../assets/dashboard';
import styles from '../../../../styles/VaultsContent.module.css'; 

function VaultPanel() {
    return (
        <div className='d-flex flex-column flex-grow-1' style={{minHeight: 0}}>
            <div className='d-flex justify-content-between align-items-center'>
                <div> <EmptySquareIcon/> Todos </div>
                <button className={styles.newVaultBtn}> <PlusIcon/> Novo </button>
            </div>
            <hr className='mb-2'/>
            <div className={styles.vaultPanelContainer}>
                <Container fluid>
                    <Row className='g-3'>
                        {Array.from({ length: 20 }).map((_, i) => (
                        <Col md={3} key={i}>
                            <Vault />
                        </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default VaultPanel;
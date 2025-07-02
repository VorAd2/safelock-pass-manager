import { PlusIcon } from '../../../../assets/dashboard';
import  NoVaultsIcon  from '../../../icons/NoVaultsIcon';
import { CustomCheckBox, VaultCard } from '../../../index'
import styles from '../../../../styles/VaultsContent.module.css';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useVaults } from '../../../context/useVaults';


function VaultPanel({modalVisibleCallback, vaultCardClick}) {
    const { vaults } = useVaults();

    return (
        <div className='d-flex flex-column flex-grow-1' style={{minHeight: 0}}>
            <div className='d-flex justify-content-between align-items-center'>
                <div> <CustomCheckBox label='Todos'/></div>
                <button type='button' onClick={() => modalVisibleCallback(true)} className={styles.newVaultBtn}>
                    <PlusIcon className='me-1'/> Vault 
                </button>
            </div>
            <hr className='mb-2'/>
            <div className={styles.vaultPanelContainer}>
                {vaults.length === 0 ? (
                    <div className={styles.emptyStateContainer}>
                        <NoVaultsIcon className={styles.emptyIcon}/>
                        <p className={styles.emptyText}>Você ainda não possui vaults.</p>
                    </div>
                ) : (
                    <Container fluid>
                        <Row className='g-3'>
                            {vaults.map((vault, i) => (
                            <Col md={3} key={i}>
                                <VaultCard vault={vault} onClick={vaultCardClick}/>
                            </Col>
                            ))}
                        </Row>
                    </Container>
                )}
                
            </div>
        </div>
    );
}

export default VaultPanel;
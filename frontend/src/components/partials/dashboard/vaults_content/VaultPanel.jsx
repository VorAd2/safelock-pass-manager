import { CustomCheckBox, VaultCard } from '../../../index'
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { PlusIcon } from '../../../../assets/dashboard';
import  NoVaultsIcon  from '../../../icons/NoVaultsIcon';
import styles from '../../../../styles/VaultsContent.module.css';
import { useEffect, useState } from 'react';
import { useVaults } from './context/useVaults';
import axios from 'axios';

const backUrl = import.meta.env.VITE_BACKEND_URL; 

function VaultPanel({username, modalVisibleCallback, vaultCardClick}) {
    const { vaults, setAllVaults } = useVaults();
    const [isLoading, setLoading] = useState(true) 

    useEffect(() => {
        const fetchVaults = async () => {
            console.log('fetchVaults rodou');
            let response;
            try {
                response = await axios.get(`${backUrl}/dashboard/vaults/${username}`)
                setAllVaults(response.data);
                console.log('Vaults fetched:', response.data);
            } catch (error) {
                console.warn('Error fetching vaults in panel:', error);
                if (error.response && error.response.status === 404) {
                    console.warn('Nenhum vault encontrado para este usuário.');
                    setAllVaults([]);
                } else {
                    console.error('Erro ao buscar vaults:', error.message);
                }
            } finally {
                setLoading(false);
            }
            
        };
        fetchVaults();
    }, [username])

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </Spinner>
            </div>
        );
    }

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
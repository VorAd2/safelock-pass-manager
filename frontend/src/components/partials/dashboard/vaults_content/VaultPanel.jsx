import { PlusIcon } from '../../../../assets/dashboard';
import  NoVaultsIcon  from '../../../icons/NoVaultsIcon';
import { CustomCheckBox, VaultCard } from '../../../index'
import styles from '../../../../styles/VaultsContent.module.css';
import { Container, Row, Col} from 'react-bootstrap';
import { useVaults } from '../../../context/useVaults';


function VaultPanel({ 
    username, modalVisibleCallback, vaultCardClick, 
    notificationHandler, vaultsFilter, vaultsSubgroup }) 
{
    const { vaults } = useVaults();
    let emptyPanelText
    switch (vaultsFilter) {
        case 'all':
            emptyPanelText = 'Você ainda não possui vaults.'
            break
        case 'favs':
            emptyPanelText = 'Você ainda não favoritou algum vault'
            break
        case 'shared':
            emptyPanelText = 'Você ainda não possui vaults compartilhados por/com você'
            break
        default:
            emptyPanelText = 'null'
    }

    return (
        <div className='d-flex flex-column flex-grow-1' style={{minHeight: 0}}>
            <div className='d-flex justify-content-between align-items-center'>
                <div> <CustomCheckBox label='Todos'/></div>
                <button type='button' 
                    onClick={() => modalVisibleCallback(true)} 
                    className={`${styles.newVaultBtn} fs-5`}
                >
                    <PlusIcon className='me-1' style={{width: '20px', height:'20px'}}/> Vault 
                </button>
            </div>
            <hr className='mb-2'/>
            <div className={styles.vaultPanelContainer}>
                {vaultsSubgroup.length === 0 ? (
                    <div className={styles.emptyStateContainer}>
                        <NoVaultsIcon className={styles.emptyIcon}/>
                        <p className={styles.emptyText}>{emptyPanelText}</p>
                    </div>
                ) : (
                    <Container fluid>
                        <Row className='g-4'>
                            {vaultsSubgroup.map((vault, i) => (
                            <Col md={3} key={i}>
                                <VaultCard 
                                vault={vault} 
                                onClick={vaultCardClick} 
                                username={username} 
                                notificationHandler={notificationHandler}
                                />
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
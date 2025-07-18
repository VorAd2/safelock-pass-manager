import { PlusIcon } from '../../../../assets/dashboard';
import  NoVaultsIcon  from '../../../icons/NoVaultsIcon';
import { CustomCheckBox, VaultCard } from '../../../index'
import styles from '../../../../styles/VaultsContent.module.css';
import { Container, Row, Col} from 'react-bootstrap';



function VaultPanel({ 
    username, modalVisibleCallback, vaultCardClick, 
    notificationHandler, vaultsFilter, vaultsSubgroup }) 
{
    let emptyPanelText
    switch (vaultsFilter) {
        case 'all':
            emptyPanelText = "You don't have vaults yet"
            break
        case 'favs':
            emptyPanelText = "You haven't favorited a vault yet"
            break
        case 'shared':
            emptyPanelText = "You don't yet have vaults shared by/with you"
            break
        default:
            emptyPanelText = 'null'
    }

    return (
        <div className='d-flex flex-column flex-grow-1' style={{minHeight: 0}}>
            <div className='d-flex justify-content-between align-items-center'>
                <div> <CustomCheckBox label='All'/></div>
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
                        <NoVaultsIcon className={styles.emptyIcon} size={128}/>
                        <p className={`${styles.emptyText} fs-5`}>{emptyPanelText}</p>
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
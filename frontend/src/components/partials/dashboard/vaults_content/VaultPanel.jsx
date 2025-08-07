import { Container, Row, Col} from 'react-bootstrap';
import { PlusIcon } from '../../../../assets/dashboard';
import { CustomCheckBox, VaultCard } from '../../../index'
import  NoVaultsIcon  from '../../../icons/NoVaultsIcon';
import styles from '../../../../styles/VaultsContent.module.css';


function VaultPanel({ 
    username, modalVisibleCallback, vaultCardClick, 
    vaultEllipsisClick, notificationHandler, vaultsFilter,
    vaultsSubgroup, setSendModalVisibleState }) 
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
        <div className={`d-flex flex-column flex-grow-1 ${styles.panelParent}`} style={{minHeight: 0}}>
            <div className='d-flex justify-content-between align-items-center p-1'>
                <div className='text-light ms-3 mt-3'> <CustomCheckBox label='All'/></div>
                <button type='button' 
                    onClick={() => modalVisibleCallback(true)} 
                    className={`${styles.newVaultBtn} fs-5 me-3 mt-3`}
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
                                vaultCardClick={vaultCardClick}
                                ellipsisClick={vaultEllipsisClick} 
                                username={username} 
                                notificationHandler={notificationHandler}
                                setSendModalVisibleState={setSendModalVisibleState}
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
import { jwtDecode } from 'jwt-decode';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { PlusIcon } from '../../../../assets/dashboard';
import { RefreshIcon } from '../../../../assets/shared';
import { CustomCheckBox, VaultCard } from '../../../index'
import NoVaultsIcon from '../../../icons/NoVaultsIcon';
import styles from '../../../../styles/VaultsContent.module.css';


function VaultPanel({
    modalVisibleCallback, vaultCardClick,
    vaultEllipsisClick, notificationHandler, vaultsFilter,
    vaultsSubgroup, setSendModalVisibleState, refreshVaults,
    isRefreshing }) {
    const username = jwtDecode(localStorage.getItem('authToken')).userData.username
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

    const getPanelBody = () => {
        if (isRefreshing) {
            return (
                <div className={styles.emptyStateContainer} role='status' aria-busy='true'>
                    <Spinner animation='border' variant='light' />
                </div>
            )
        } else if (vaultsSubgroup.length === 0) {
            return (
                <div className={styles.emptyStateContainer}>
                    <NoVaultsIcon className={styles.emptyIcon} size={128} />
                    <p className={`${styles.emptyText} fs-5`} role='status'>{emptyPanelText}</p>
                </div>
            )
        } else {
            return (
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
            )
        }
    }

    return (
        <div className={`d-flex flex-column flex-grow-1 ${styles.panelParent}`} style={{ minHeight: 0 }}>
            <header className='d-flex justify-content-between align-items-center p-1'>
                <span className='text-light ms-3 mt-3'> <CustomCheckBox label='All' /></span>
                <div className='d-flex justify-content-betwenn align-items-center'>
                    <button type='button'
                        onClick={refreshVaults}
                        className={`${styles.panelHeaderBtn} fs-5 me-3 mt-3`}
                    >
                        <RefreshIcon className='me-1' style={{ width: '20px', height: '20px' }} ariaHidden='true' />
                        Refresh
                    </button>
                    <button type='button'
                        onClick={() => modalVisibleCallback(true)}
                        className={`${styles.panelHeaderBtn} fs-5 me-3 mt-3`}
                    >
                        <PlusIcon className='me-1' style={{ width: '20px', height: '20px' }} ariaHidden='true' />
                        Vault
                    </button>
                </div>
            </header>
            <hr className='mb-2' />
            <section className={styles.vaultPanelContainer}>{getPanelBody()}</section>
        </div>
    )
}

export default VaultPanel
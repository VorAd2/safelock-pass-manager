import { useVaults } from '../../../context/useVaults';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backCodes  from '../../../../back_codes';
import { CustomCheckbox, MiniModal } from '../../../shared';
import { VaultIcon, EllipsisIcon, UserAvatar, StarIcon, UnstarIcon, SendIcon, TrashIcon } from '../../../../assets/dashboard';
import { RemoveIcon } from '../../../../assets/shared';
import styles from '../../../../styles/VaultsContent.module.css';

const BACK_URL = import.meta.env.VITE_BACKEND_URL;


function VaultCard({
    vault, vaultCardClick, username, 
    ellipsisClick, notificationHandler, setSendModalVisibleState
}) {
    const vaultTitle = vault.title
    const toFavorite = !(vault.favoritedBy.some(u => u === username ))
    const { setFavoritism, deleteVault } = useVaults()
    const navigate = useNavigate()

    const handleCheckboxClick = (e) => {
        e.stopPropagation();
    };

    const handleFavoriteAction = async (e, closePopover) => {
        e.stopPropagation()
        const data = {
            toFavorite: toFavorite,
            vaultId: vault._id,
            username: username
        }
        const authToken = localStorage.getItem('authToken')
        if (!authToken) {
            console.warn("No token found. Redirecting to signin.");
            navigate("/signin");
            return;
        }
        try {
            await axios.patch(`${BACK_URL}/dashboard/vaults/favoritism`, data,
                { headers: {Authorization: `Bearer ${authToken}` }}
            )
            setFavoritism(vault._id, username, toFavorite)
            const message = toFavorite
                ? 'Vault favorited successfully'
                : 'Vault unfavorited successfully'
            notificationHandler(true, message, 'success')
        } catch (err) {
            if (err.response && err.response.data.code === backCodes.ACCESS_DENIED) {
                alert('Access denied or session expired. Please log in again.')
                navigate('/signin')
            } else {
                notificationHandler(true, 'Unknown error. Please, try again', 'error')
                console.warn(`Erro ao deletar vault: ${err}`)
            }
        } finally {
            closePopover(e)
        }
    }

    const handleSendAction = (e, closePopover) => {
        closePopover(e)
        setSendModalVisibleState({show: true, fromVaultInfo: false})
    }

    const handleDelete = async (e, closePopover) => {
        e.stopPropagation()
        try {
            let authToken = localStorage.getItem('authToken')
            if (!authToken) {
                console.warn("No token found. Redirecting to signin.");
                navigate("/signin");
                return;
            }
            const route = `${BACK_URL}/dashboard/vaults`
            const config = {
                headers: { Authorization: `Bearer ${authToken}` },
                data: {
                    ownerUsername: vault.ownerUser,
                    vaultId: vault._id,
                    vaultTitle
                }
            }
            await axios.delete(route, config)
            deleteVault(vault._id)
            notificationHandler(true, 'Vault deleted successfully', 'success')
        } catch (err) {
            if (err.response && err.response.data.code === backCodes.ACCESS_DENIED) {
                alert('Access denied or session expired. Please log in again.')
                navigate('/signin')
            } else {
                notificationHandler(true, 'Unknown error. Please, try again', 'error')
                console.warn(`Erro ao deletar vault: ${err}`)
            }
        } finally {
            closePopover(e)
        }   
    }

    const handleRemoveSharing = (e, closePopover) => {
        e.stopPropagation()
        console.log(`Removing sharing: ${vault._id} for user ${username}`)
        const authToken = localStorage.getItem('authToken')
        if (!authToken) {
            console.warn("No token found. Redirecting to signin.");
            navigate("/signin");
            return;
        }
        const route = `${BACK_URL}/dashboard/vaults/sharing`
        const config = {
            headers: { Authorization: `Bearer ${authToken}` },
            data: {
                vaultId: vault._id,
                vaultTitle,
                username
            }
        }
        axios.delete(route, config)
            .then(() => {
                deleteVault(vault._id)
                notificationHandler(true, 'Vault sharing removed successfully', 'success')
            })
            .catch(err => {
                if (err.response && err.response.data.code === backCodes.ACCESS_DENIED) {
                    alert('Access denied or session expired. Please log in again.')
                    navigate('/signin')
                } else if (err.response && err.response.data.code === backCodes.VAULT_SHARING_NOT_FOUND) {
                    notificationHandler(true, 'Vault sharing not found. Please, try again or verify your vaults', 'error')
                } else {
                    notificationHandler(true, 'Unknown error. Please, try again', 'error')
                    console.warn(`Erro ao deletar sharing de vault: ${err}`)
                }
            })
            .finally(() => { 
                closePopover(e)
            })
    }

    function getEllipsisModal() {
        const canShareVault = !(vault.sharedUsers.some(u => u === username))
        const canDeleteVault = vault.ownerUser === username
        const sendSpanStyle = canShareVault ? '' : 'text-decoration-line-through text-secondary'
        const noHoverClassSend = canShareVault ? '' : 'noHoverClass'
        const exclusionStyle = canDeleteVault 
            ? {color: 'var(--red-color)', fill: 'var(--red-color)'}
            : {color: 'var(--action-yellow-color)', fill: 'var(--action-yellow-color)'}
        const modalClick = () => ellipsisClick(vault._id)

        return (
            <MiniModal
                ButtonIcon={EllipsisIcon}
                buttonClass={styles.vaultCardEllipsisWrapper}
                iconClass={styles.vaultCardEllipsis}
                onClick={modalClick}
                >
                    {({ closePopover, popoverItemClass}) => (
                        <>
                            <button type="button" className={popoverItemClass} onClick={(e) => { handleFavoriteAction(e, closePopover) }}>
                                <div className="d-flex align-items-center">
                                    {toFavorite ? <StarIcon className='me-2'/> : <UnstarIcon className='me-2'/>}
                                    <span>{toFavorite ? 'Favorite' : 'Unfavorite'}</span>
                                </div>
                            </button>
                            <button type="button" className={`${popoverItemClass} ${noHoverClassSend}`} 
                            onClick={
                                (e) => {
                                    e.stopPropagation()
                                    if (canShareVault) handleSendAction(e, closePopover); 
                                }
                            }
                            style={{ cursor: canShareVault ? 'pointer' : 'not-allowed' }}
                            >
                                <div className="d-flex align-items-center">
                                    <SendIcon className={`me-2 ${sendSpanStyle}`}/>
                                    <span className={sendSpanStyle}>Share</span>
                                </div>
                            </button>
                            <button type="button" 
                            className={popoverItemClass}
                            onClick={
                                (e) => {
                                    e.stopPropagation()
                                    if (canDeleteVault) {
                                        handleDelete(e, closePopover)
                                    } else {
                                        handleRemoveSharing(e, closePopover)
                                    }
                                }
                            }
                            >
                                <div className={`d-flex align-items-center`} style={exclusionStyle}>
                                    {canDeleteVault ? <TrashIcon className='me-2'/> : <RemoveIcon className='me-2'/>}
                                    <span>{canDeleteVault ? 'Delete' : 'Leave'}</span>
                                </div>
                            </button>
                        </>
                    )
                }
            </MiniModal>
        )
    }

    return (
        <div className={styles.vaultCard} onClick={() => vaultCardClick(vault._id)}>
            <div className={styles.topBar}>
                <CustomCheckbox onClick={handleCheckboxClick}/>
                {getEllipsisModal()}
            </div>

            <div className={styles.iconArea}>
                <VaultIcon className={styles.vaultIcon} />
            </div>

            <div className={styles.bottomRow}>
                <span className={styles.vaultName}>{vaultTitle}</span>
                <div className={styles.avatarCircle}>
                    <UserAvatar />
                </div>
            </div>
        </div>
    );
}

export default VaultCard;

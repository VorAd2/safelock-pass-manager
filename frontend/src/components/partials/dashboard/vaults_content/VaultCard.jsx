import { useVaults } from '../../../context/useVaults';
import { useNavigate } from 'react-router-dom';
import backCodes from '../../../../back_codes';
import { CustomCheckbox, MiniModal } from '../../../shared';
import { VaultIcon2, EllipsisIcon, UserAvatar, StarIcon, UnstarIcon, SendIcon, TrashIcon } from '../../../../assets/dashboard';
import { RemoveIcon } from '../../../../assets/shared';
import styles from '../../../../styles/VaultsContent.module.css';
import { AvatarColorManager } from '../../../../lib/avatarColorManager.js';
import vaultService from '../../../../services/vaultService.js';


function VaultCard({
    vault, vaultCardClick, username,
    ellipsisClick, notificationHandler, setSendModalVisibleState
}) {
    const avatarBackColor = vault.ownerUser === username
        ? 'var(--lessdark-blue-color)'
        : AvatarColorManager.getAvatarBgColor(vault.ownerUser)
    const vaultTitle = vault.title
    const toFavorite = !(vault.favoritedBy.some(u => u === username))
    const { setFavoritism, deleteVault } = useVaults()
    const navigate = useNavigate()

    const handleCheckboxClick = (e) => {
        e.stopPropagation();
    }

    const handleFavoriteAction = async (e, closePopover) => {
        e.stopPropagation()
        const data = {
            toFavorite: toFavorite,
            vaultId: vault._id,
            username: username
        }
        const authToken = localStorage.getItem('authToken')
        if (!authToken) {
            alert('No token found. Redirecting...')
            navigate("/signin")
            return
        }
        try {
            await vaultService.favoriteVault(authToken, data)
            setFavoritism(vault._id, username, toFavorite)
            const message = toFavorite
                ? 'Vault favorited successfully'
                : 'Vault unfavorited successfully'
            notificationHandler(true, message, 'success')
        } catch (err) {
            if (err.response) {
                const code = err.response.data?.code
                const message = err.response.data?.message
                if (code === backCodes.ACCESS_DENIED) {
                    alert(message)
                    localStorage.removeItem('authToken')
                    navigate('/signin')
                } else {
                    alert(backCodes.GENERIC_ERROR_FEEDBACK)
                    console.warn('Erro na presença de response:', err.response)
                }
            } else if (err.request) {
                alert(backCodes.RESPONSE_ERROR_FEEDBACK)
                console.warn('Erro na presença de request:', err.request)
            } else {
                alert(backCodes.GENERIC_ERROR_FEEDBACK)
                console.warn('Erro inesperado:', err.message)
            }
        } finally {
            closePopover(e)
        }
    }

    const handleSendAction = (e, closePopover) => {
        closePopover(e)
        setSendModalVisibleState({ visible: true, fromVaultInfoModal: false })
    }

    const handleDelete = async (e, closePopover) => {
        e.stopPropagation()
        try {
            let authToken = localStorage.getItem('authToken')
            if (!authToken) {
                alert('No token found. Redirecting...')
                navigate("/signin")
                return
            }
            await vaultService.deleteVault(authToken, vault)
            deleteVault(vault._id, vault.ownerUser)
            notificationHandler(true, 'Vault deleted successfully', 'success')
        } catch (err) {
            if (err.response) {
                const code = err.response.data?.code
                const message = err.response.data?.message
                if (code === backCodes.ACCESS_DENIED) {
                    alert(message)
                    localStorage.removeItem('authToken')
                    navigate('/signin')
                } else {
                    alert(backCodes.GENERIC_ERROR_FEEDBACK)
                    console.warn('Erro na presença de response:', err.response)
                }
            } else if (err.request) {
                alert(backCodes.RESPONSE_ERROR_FEEDBACK)
                console.warn('Erro na presença de request:', err.request)
            } else {
                alert(backCodes.GENERIC_ERROR_FEEDBACK)
                console.warn('Erro inesperado:', err.message)
            }
        } finally {
            closePopover(e)
        }
    }

    const handleRemoveSharing = async (e, closePopover) => {
        e.stopPropagation()
        const authToken = localStorage.getItem('authToken')
        if (!authToken) {
            alert('No token found. Redirecting...')
            navigate("/signin")
            return
        }
        try {
            await vaultService.deleteSharing(authToken, vault, username)
            deleteVault(vault._id, vault.ownerUser)
            notificationHandler(true, 'Vault sharing removed successfully', 'success')
        } catch (err) {
            if (err.response) {
                const code = err.response.data?.code
                const message = err.response.data?.message
                if (code === backCodes.ACCESS_DENIED) {
                    alert(message)
                    localStorage.removeItem('authToken')
                    navigate('/signin')
                } else if (code === backCodes.VAULT_SHARING_NOT_FOUND) {
                    alert(message)
                } else {
                    alert(backCodes.GENERIC_ERROR_FEEDBACK)
                    console.warn('Erro na presença de response:', err.response)
                }
            } else if (err.request) {
                alert(backCodes.RESPONSE_ERROR_FEEDBACK)
                console.warn('Erro na presença de request:', err.request)
            } else {
                alert(backCodes.GENERIC_ERROR_FEEDBACK)
                console.warn('Erro inesperado:', err.message)
            }
        } finally {
            closePopover(e)
        }
    }

    function getEllipsisModal() {
        const canShareVault = !(vault.sharedUsers.some(u => u === username))
        const canDeleteVault = vault.ownerUser === username
        const sendSpanStyle = canShareVault ? '' : 'text-decoration-line-through text-secondary'
        const noHoverClassSend = canShareVault ? '' : 'noHoverClass'
        const exclusionStyle = canDeleteVault
            ? { color: 'var(--red-color)', fill: 'var(--red-color)' }
            : { color: 'var(--action-yellow-color)', fill: 'var(--action-yellow-color)' }
        const modalClick = () => ellipsisClick(vault._id)

        return (
            <MiniModal
                ButtonIcon={EllipsisIcon}
                buttonClass={styles.vaultCardEllipsisWrapper}
                iconClass={styles.vaultCardEllipsis}
                onClick={modalClick}
            >
                {({ closePopover, popoverItemClass }) => (
                    <>
                        <button type="button" className={popoverItemClass} onClick={(e) => { handleFavoriteAction(e, closePopover) }}>
                            <div className="d-flex align-items-center">
                                {toFavorite ? <StarIcon className='me-2' /> : <UnstarIcon className='me-2' />}
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
                                <SendIcon className={`me-2 ${sendSpanStyle}`} />
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
                                {canDeleteVault ? <TrashIcon className='me-2' /> : <RemoveIcon className='me-2' />}
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
        <article className={styles.vaultCard} onClick={() => vaultCardClick(vault._id)}>
            <header className={styles.topBar}>
                <CustomCheckbox onClick={handleCheckboxClick} />
                {getEllipsisModal()}
            </header>
            <div className={styles.iconArea}>
                <VaultIcon2 className={styles.vaultIcon} />
            </div>
            <footer className={styles.bottomRow}>
                <span className={styles.vaultName}>{vaultTitle}</span>
                <div className={styles.avatarCircle} style={{ backgroundColor: avatarBackColor }}>
                    <UserAvatar />
                </div>
            </footer>
        </article>
    )
}

export default VaultCard;

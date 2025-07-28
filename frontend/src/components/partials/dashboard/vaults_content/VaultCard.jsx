import { useVaults } from '../../../context/useVaults';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CustomCheckbox, MiniModal } from '../../../shared';
import { VaultIcon, EllipsisIcon, UserAvatar, StarIcon, UnstarIcon, SendIcon, TrashIcon } from '../../../../assets/dashboard';
import styles from '../../../../styles/VaultsContent.module.css';

const BACK_URL = import.meta.env.VITE_BACKEND_URL;


function VaultCard({
    vault, onClick, username, 
    ellipsisClick, notificationHandler, setSendModalVisible
}) {
    const vaultTitle = vault.title
    const toFavorite = !(vault.favoritedBy.some(u => u === username ))
    const { setFavoritism, deleteVault } = useVaults()
    const navigate = useNavigate()

    useEffect(() => {
        console.log(`toFavorite de ${vaultTitle}: ${toFavorite}`)
    })

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
            setFavoritism(vaultTitle, username, toFavorite)
            const message = toFavorite
                ? 'Vault favorited successfully'
                : 'Vault unfavorited successfully'
            notificationHandler(true, message, 'success')
        } catch (err) {
            console.warn(`Erro no favoritismo: ${err}`)
        } finally {
            closePopover(e)
        }
    }

    const handleSendAction = (e, closePopover) => {
        closePopover(e)
        setSendModalVisible(true)
    }

    const handleDeleteAction = async (e, closePopover) => {
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
            console.warn(`Erro ao deletar vault: ${err}`)
        } finally {
            closePopover(e)
        }   
    }

    function getEllipsisModal() {
        const canShareVault = !(vault.sharedUsers.some(u => u === username))
        const canDeleteVault = vault.ownerUser === username
        const sendSpanStyle = canShareVault ? '' : 'text-decoration-line-through text-secondary'
        const noHoverClassSend = canShareVault ? '' : 'noHoverClass'
        const deleteSpanStyle = canDeleteVault ? '' : 'text-decoration-line-through text-secondary'
        const noHoverClassDelete = canDeleteVault ? '' : 'noHoverClass'
        const modalClick = () => ellipsisClick(vault.title)
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
                            className={`${popoverItemClass} text-danger ${noHoverClassDelete}`}
                            style={{cursor: canDeleteVault ? 'pointer' : 'not-allowed'}}
                            onClick={
                                (e) => {
                                    e.stopPropagation()
                                    if (canDeleteVault) handleDeleteAction(e, closePopover); 
                                }
                            }
                            >
                                <div className="d-flex align-items-center">
                                    <TrashIcon className={`me-2 ${deleteSpanStyle}`}/>
                                    <span className={deleteSpanStyle}>Delete</span>
                                </div>
                            </button>
                        </>
                    )
                }
            </MiniModal>
        )
    }

    return (
        <div className={styles.vaultCard} onClick={() => onClick(vaultTitle)}>
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

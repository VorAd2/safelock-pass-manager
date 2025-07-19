import { VaultIcon, EllipsisIcon, UserAvatar, StarIcon, UnstarIcon, SendIcon, TrashIcon } from '../../../../assets/dashboard';
import styles from '../../../../styles/VaultsContent.module.css';
import { CustomCheckbox, MiniModal } from '../../../shared';
import { useVaults } from '../../../context/useVaults';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const BACK_URL = import.meta.env.VITE_BACKEND_URL;

function VaultCard({vault, onClick, username, notificationHandler, setSendModalVisible}) {
    const vaultTitle = vault.title
    const toFavorite = !(vault.favoritedBy.some(u => u === username ))
    const { setFavoritism } = useVaults()
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

    function getEllipsisModal() {
        const canShareVault = !(vault.sharedUsers.some(u => u === username))
        const sendSpanStyle = canShareVault ? 'text-decoration-line-through text-secondary' : ''
        return (
            <MiniModal
                ButtonIcon={EllipsisIcon}
                buttonClass={styles.vaultCardEllipsisWrapper}
                iconClass={styles.vaultCardEllipsis}
                >
                    {({ closePopover, popoverItemClass}) => (
                        <>
                            <button type="button" className={popoverItemClass} onClick={(e) => { handleFavoriteAction(e, closePopover) }}>
                                <div className="d-flex align-items-center">
                                    {toFavorite ? <StarIcon className='me-2'/> : <UnstarIcon className='me-2'/>}
                                    <span>{toFavorite ? 'Favorite' : 'Unfavorite'}</span>
                                </div>
                            </button>
                            <button type="button" className={popoverItemClass} onClick={canShareVault ? (e) => { handleSendAction(e, closePopover)} : null} >
                                <div className="d-flex align-items-center">
                                    <SendIcon className={`me-2 ${sendSpanStyle}`}/>
                                    <span className={sendSpanStyle}>Share</span>
                                </div>
                            </button>
                            <button type="button" 
                            className={popoverItemClass}
                            style={{color:'var(--red-color)', fill:'var(--red-color)'}}
                            onClick={(e) => { console.log("Excluir vault"); closePopover(e); }}
                            >
                                <div className="d-flex align-items-center">
                                    <TrashIcon className='me-2'/>
                                    <span>Delete</span>
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

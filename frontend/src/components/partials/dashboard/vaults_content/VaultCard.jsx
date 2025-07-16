import { VaultIcon, EllipsisIcon, UserAvatar, StarIcon, SendIcon, TrashIcon } from '../../../../assets/dashboard';
import styles from '../../../../styles/VaultsContent.module.css';
import { CustomCheckbox, MiniModal } from '../../../shared';
import { useVaults } from '../../../context/useVaults';
import { useEffect } from 'react';
import axios from 'axios';
const BACK_URL = import.meta.env.VITE_BACKEND_URL;

function VaultCard({vault, onClick, username, notificationHandler}) {
    const vaultTitle = vault.title
    const toFavorite = !(vault.favoritedBy.some(u => u === username ))
    const { setFavoritism, getFavorites } = useVaults()

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
            console.warn("Nenhum token encontrado. Redirecionando para login.");
            navigate("/signin");
            return;
        }
        try {
            await axios.patch(`${BACK_URL}/dashboard/vaults/favoritism`, data,
                { headers: {Authorization: `Bearer ${authToken}` }}
            )
            setFavoritism(vaultTitle, username, toFavorite)
            const message = toFavorite
                ? 'Vault favoritado com sucesso'
                : 'Vault desfavoritado com sucesso'
            notificationHandler(true, message, 'success')
            console.log(`Vaults favoritos: ${JSON.stringify(getFavorites(username))}`)
        } catch (err) {
            console.warn(`Erro no favoritismo: ${err.message}`)
        } finally {
            closePopover(e)
        }
    }
    
    function getEllipsisModal() {
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
                                    <StarIcon className='me-2'/>
                                    <span>Favorite</span>
                                </div>
                            </button>
                            <button type="button" className={popoverItemClass} onClick={(e) => { console.log("Compartilhar vault"); closePopover(e); }}>
                                <div className="d-flex align-items-center">
                                    <SendIcon className='me-2'/>
                                    <span>Share</span>
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

import { VaultIcon, EllipsisIcon, UserAvatar } from '../../../../assets/dashboard';
import styles from '../../../../styles/VaultsContent.module.css';
import { CustomCheckbox, MiniModal } from '../../../shared';


function VaultCard({vault, onClick}) {
    const vaultTitle = vault.title

    const handleCheckboxClick = (e) => {
        e.stopPropagation();
    };
    
    return (
        <div className={styles.vaultCard} onClick={() => onClick(vaultTitle)}>
            <div className={styles.topBar}>
                <CustomCheckbox onClick={handleCheckboxClick}/>
                <MiniModal
                ButtonIcon={EllipsisIcon}
                buttonClass={styles.vaultCardEllipsisWrapper}
                iconClass={styles.vaultCardEllipsis}
                >
                    {({ closePopover, popoverItemClass}) => (
                        <>
                        <button type="button" className={popoverItemClass} onClick={(e) => { console.log("Favoritar vault"); closePopover(e); }}>
                            Favoritar
                        </button>
                        <button type="button" className={popoverItemClass} onClick={(e) => { console.log("Compartilhar vault"); closePopover(e); }}>
                            Compartilhar
                        </button>
                        <button type="button" 
                        className={popoverItemClass}
                        style={{color:'red'}}
                        onClick={() => { console.log("Excluir vault"); closePopover(); }}>
                            Excluir
                        </button>
                        </>
                        )
                    }
                </MiniModal>
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

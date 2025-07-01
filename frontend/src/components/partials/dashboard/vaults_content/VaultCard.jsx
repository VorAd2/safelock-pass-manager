import { CustomCheckBox } from '../../..';
import styles from '../../../../styles/VaultsContent.module.css';
import { VaultIcon, EllipsisIcon, UserAvatar } from '../../../../assets/dashboard';

function VaultCard({vault, onClick}) {
    const vaultTitle = vault.title
    // Handler para evitar propagação do clique do checkbox
    const handleCheckboxClick = (e) => {
        e.stopPropagation();
    };
    return (
        <div className={styles.vaultCard} onClick={() => onClick(vaultTitle)}>
            <div className={styles.topBar}>
                <CustomCheckBox onClick={handleCheckboxClick}/>
                <EllipsisIcon className={styles.icon} />
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

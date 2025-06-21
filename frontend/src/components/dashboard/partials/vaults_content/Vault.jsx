import styles from '../../../../styles/VaultsContent.module.css';
import { VaultIcon, EllipsisIcon, EmptySquareIcon, UserAvatar } from '../../../../assets/dashboard';

function Vault() {
  return (
    <div className={styles.vaultCard}>
        <div className={styles.topBar}>
            <EmptySquareIcon className={styles.icon} />
            <EllipsisIcon className={styles.icon} />
        </div>

        <div className={styles.iconArea}>
            <VaultIcon className={styles.vaultIcon} />
        </div>

        <div className={styles.bottomRow}>
            <span className={styles.vaultName}>Nome do Cofre</span>
            <div className={styles.avatarCircle}>
                <UserAvatar />
            </div>
        </div>
    </div>
  );
}

export default Vault;

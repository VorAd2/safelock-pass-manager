/* eslint-disable no-unused-vars */
import { CustomCheckBox } from '../../..';
import styles from '../../../../styles/VaultsContent.module.css';
import { VaultIcon, EllipsisIcon, UserAvatar } from '../../../../assets/dashboard';

function VaultCard({vault, onClick}) {
    const vaultName = vault.name
    return (
        <div className={styles.vaultCard} onClick={onClick}>
            <div className={styles.topBar}>
                <CustomCheckBox/>
                <EllipsisIcon className={styles.icon} />
            </div>

            <div className={styles.iconArea}>
                <VaultIcon className={styles.vaultIcon} />
            </div>

            <div className={styles.bottomRow}>
                <span className={styles.vaultName}>OO</span>
                <div className={styles.avatarCircle}>
                    <UserAvatar />
                </div>
            </div>
        </div>
    );
}

export default VaultCard;

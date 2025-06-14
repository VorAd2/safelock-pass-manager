import {ArrowLeftIcon, ArrowRightIcon, PremiumIcon} from '../../../assets/dashboard';
import styles from '../../../styles/Sidebar.module.css';
import { ACCOUNT_UP_ROUTE } from '../../../routes'; 
import { Link } from 'react-router-dom';

function SidebarFooter({isExpanded, onClick}) {
    return (
        <>
        <hr className={styles.sidebarDivider} />
        <div className={styles.sidebarFooter}>
            <div className={styles.upgradeContainer}>
                <div className={styles.upgradeElements}>
                    <Link
                        to={ACCOUNT_UP_ROUTE}
                        className={`${styles.upgradeLink}`}
                    > <PremiumIcon className={styles.upgradeIcon}/> Account Upgrade </Link>
                    <p className={styles.currentPlan} >Current plan: Standard</p>
                </div>
            </div>
            <button type='button' className={`${styles.sidebarToggleBtn}`} onClick={onClick}>
                {isExpanded ? <ArrowLeftIcon className={styles.toogleBtnIcon}/> : <ArrowRightIcon className={styles.toogleBtnIcon}/>}
            </button>
        </div>
        </>
    )   
}

export default SidebarFooter;
import {Button} from 'react-bootstrap';
import {ArrowLeftIcon, ArrowRightIcon, PremiumIcon} from '../../../assets/dashboard';
import styles from '../../../styles/Sidebar.module.css'; 

function SidebarFooter({isExpanded, onClick}) {
    return (
        <div className="mt-auto p-3">
            <hr className="bg-light" />
            <p><PremiumIcon/> Torne-se Premium</p>
            <Button variant="outline-light" className={`${styles.sidebarToggleBtn}`} onClick={onClick}>
                {isExpanded ? <ArrowLeftIcon className={styles.toogleBtnIcon}/> : <ArrowRightIcon className={styles.toogleBtnIcon}/>}
            </Button>
        </div>
    )   
}

export default SidebarFooter;
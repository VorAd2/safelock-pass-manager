import { Container, Col} from 'react-bootstrap';
import { StarIcon, PeopleIcon, FolderIcon, TrashIcon } from '../../../../assets/dashboard'
import styles from '../../../../styles/VaultsContent.module.css'

function FloatingBox() {
    return (
        <div className={styles.floatingBoxContainer}>
            <div className={styles.searchVaultSection}>
                <div>Pesquisar cofre</div>
            </div>
            <div className={styles.optionsList}>
                <div> <StarIcon/> Favoritos</div> 
                <div> <PeopleIcon/> Compartilhados</div>
                <div> <TrashIcon/> Lixeira</div>
            </div>
        </div>
    )
}

export default FloatingBox
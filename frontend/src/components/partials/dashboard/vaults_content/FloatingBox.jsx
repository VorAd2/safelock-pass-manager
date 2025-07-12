import { BoxesIcon, StarIcon, PeopleIcon, TrashIcon } from '../../../../assets/dashboard'
import styles from '../../../../styles/VaultsContent.module.css'

function FloatingBox() {
    return (
        <div className={styles.floatingBoxContainer}>
            <div className={styles.searchVaultSection}>
                <div>Procurar cofres</div>
            </div>
            <div className={styles.optionsList}>
                <div> <BoxesIcon/> Todos os cofres</div>
                <div> <StarIcon/> Favoritos</div> 
                <div> <PeopleIcon/> Compartilhados</div>
                <div> <TrashIcon/> Lixeira</div>
            </div>
        </div>
    )
}

export default FloatingBox
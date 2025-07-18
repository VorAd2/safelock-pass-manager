import { BoxesIcon, StarIcon, PeopleIcon, TrashIcon } from '../../../../assets/dashboard'
import styles from '../../../../styles/VaultsContent.module.css'

function FloatingBox({ setVaultsFilter }) {
    return (
        <div className={styles.floatingBoxContainer}>
            <div className={styles.searchVaultSection}>
                <div>Procurar cofres</div>
            </div>
            <div className={styles.optionsList}>

                <div
                role='button'
                tabIndex={0}
                onClick={() => setVaultsFilter('all')}
                > 
                    <BoxesIcon/> Todos os cofres
                </div>

                <div
                role='button'
                tabIndex={0}
                onClick={() => setVaultsFilter('favs')}
                > 
                    <StarIcon/> Favoritos
                </div> 

                <div
                role='button'
                tabIndex={0}
                onClick={() => setVaultsFilter('shared')}
                > 
                    <PeopleIcon/> Compartilhados
                </div>

                <div
                role='button'
                tabIndex={0}
                onClick={() => setVaultsFilter('all')}
                > 
                    <TrashIcon/> Lixeira
                </div>
            </div>
        </div>
    )
}

export default FloatingBox
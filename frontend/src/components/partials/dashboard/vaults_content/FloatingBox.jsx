import { BoxesIcon, StarIcon, PeopleIcon } from '../../../../assets/dashboard'
import styles from '../../../../styles/VaultsContent.module.css'

function FloatingBox({ setVaultsFilter }) {
    return (
        <div className={styles.floatingBoxContainer}>
            <div className={styles.searchVaultSection}>
                <div>Filter vaults</div>
            </div>
            <div className={styles.optionsList}>

                <div
                role='button'
                tabIndex={0}
                onClick={() => setVaultsFilter('all')}
                > 
                    <BoxesIcon/> All vaults
                </div>

                <div
                role='button'
                tabIndex={0}
                onClick={() => setVaultsFilter('favs')}
                > 
                    <StarIcon/> Favorited
                </div> 

                <div
                role='button'
                tabIndex={0}
                onClick={() => setVaultsFilter('shared')}
                > 
                    <PeopleIcon/> Shared
                </div>
            </div>
        </div>
    )
}

export default FloatingBox
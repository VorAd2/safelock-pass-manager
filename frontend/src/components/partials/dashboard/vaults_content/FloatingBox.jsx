import { useState } from 'react'
import { BoxesIcon, StarIcon, PeopleIcon } from '../../../../assets/dashboard'
import styles from '../../../../styles/FloatingBox.module.css'


function FloatingBox({ setVaultsFilter }) {
    const [active, setActiveOption] = useState('all')

    return (
        <div className={styles.floatingBoxContainer}>
            <div className={styles.searchVaultSection}>
                <div>Filter vaults</div>
            </div>
            <div className={styles.optionsList}>

                <div
                role='button'
                tabIndex={0}
                onClick={() => {
                    setVaultsFilter('all')
                    setActiveOption('all')
                }}
                > 
                    <div className='d-flex align-items-center'>
                        {active === 'all' && <div className={styles.activeRectangle}></div>}
                        <span className='ms-1'><BoxesIcon/> All vaults</span>
                    </div>
                    
                </div>

                <div
                role='button'
                tabIndex={0}
                onClick={() => {
                    setVaultsFilter('favs')
                    setActiveOption('favs')
                }}
                >
                    <div className='d-flex align-items-center'>
                        {active === 'favs' && <div className={styles.activeRectangle}></div>}
                        <span className='ms-1'><StarIcon/> Favorited</span>
                    </div> 
                    
                </div> 

                <div
                role='button'
                tabIndex={0}
                onClick={() => {
                    setVaultsFilter('shared')
                    setActiveOption('shared')
                }}
                > 
                    <div className='d-flex align-items-center'>
                        {active === 'shared' && <div className={styles.activeRectangle}></div>}
                        <span className='ms-1'><PeopleIcon/> Shared</span>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default FloatingBox
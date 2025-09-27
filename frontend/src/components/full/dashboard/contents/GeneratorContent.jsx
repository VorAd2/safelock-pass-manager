import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { SegmentedPill, StrengthSlider } from '../../../index.js'
import styles from '../../../../styles/GeneratorContent.module.css'
import { CopyIcon, RefreshIcon2 } from '../../../../assets/shared/index.js'


const GeneratorContent = () => {
    const [product, setProduct] = useState('sasasaaAjjasASa')

    const handleRefresh = () => {
        setProduct('sasasaaAjjasASa')
    }

    const handleCopy = () => {
        setProduct('KKSAAHSKASKAsak%#42g1')
    }

    function getProductStage() {
        return (
            <div className='d-flex flex-column mt-5 px-4'>
                <div className='d-flex flex-column align-items-start' style={{ width: '45%' }}>
                    <div className='d-flex align-items-center w-100 fs-5 text-white'>
                        <span>{product}</span>
                        <div className='d-flex justify-content-center align-items-center ms-auto'>
                            <div
                                className={`${styles.stageButton} d-flex justify-content-center align-items-center p-2 me-2`}
                                onClick={handleRefresh}
                            >
                                <RefreshIcon2 />
                            </div>
                            <div
                                className={`${styles.stageButton} d-flex justify-content-center align-items-center p-2`}
                                onClick={handleCopy}
                            >
                                <CopyIcon style={{ width: '20px', height: '20px' }} />
                            </div>
                        </div>
                    </div>
                    <hr className={styles.stageLine} style={{ width: '100%' }} />
                </div>
            </div>
        )
    }

    return (
        <div className='d-flex flex-column'>
            <SegmentedPill />
            {getProductStage()}
            <StrengthSlider />
            <div className='px-4'>
                <Button
                    variant='primary'
                    className='fs-5 text-white'
                    style={{ marginTop: '7rem' }}>Generator History</Button>
            </div>
        </div>
    )
}

export default GeneratorContent
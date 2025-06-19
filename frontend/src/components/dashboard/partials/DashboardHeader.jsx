import { UserAvatar } from '../../../assets/dashboard'

function DashboardHeader({title}) {
    return (
        <header className='d-flex justify-content-between align-items-center px-4'>
            <h1 style={{color:'var(--lessdark-blue-color'}}>{title}</h1>
            <div className='d-flex align-items-center'>
                <p className='mb-0'>VorAd2</p>
                <div
                    style={{
                        width: '30px',
                        height: '30px',
                        marginLeft: '0.5rem',
                        borderRadius: '50%',
                        backgroundColor: 'var(--lessdark-blue-color)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                    }}
                    >
                    <UserAvatar style={{ width: '16px', height: '16px' }} /> 
                </div>
            </div>
        </header>
    )
}

export default DashboardHeader
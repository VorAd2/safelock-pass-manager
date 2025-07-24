import { UserAvatar } from '../../../../assets/dashboard'
import  BellPopover  from '../header/BellPopover'


function DashboardHeader({title, username}) {
    return (
        <header className='d-flex justify-content-between align-items-center px-4 pt-2 mb-2 fs-5 text-light'>
            <h1 className='mt-2'>{title}</h1>
            <div className='d-flex align-items-center'>
                <BellPopover/>
                <p className='mb-0'>{username}</p>
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        marginLeft: '0.5rem',
                        borderRadius: '50%',
                        backgroundColor: 'var(--lessdark-blue-color)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                    }}
                    >
                    <UserAvatar style={{ width: '18px', height: '18px' }} /> 
                </div>
            </div>
        </header>
    )
}

export default DashboardHeader
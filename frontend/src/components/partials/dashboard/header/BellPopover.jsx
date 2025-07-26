import { OverlayTrigger, Popover, ListGroup, Button, Row, Col } from 'react-bootstrap';
import { BellIcon, RefreshIcon } from '../../../../assets/shared';
import { VaultIcon, FingerprintIcon, TrashIcon } from '../../../../assets/dashboard';
import styles from '../../../../styles/DashboardHeader.module.css';
import { useEffect, useState, useRef } from 'react';
import { socket } from '../../../../socket';

const BellPopover = () => {
  const [hasNotification, setHasNotification] = useState(false)
  const [notifications, setNotifications] = useState([])
  const overlayRef = useRef(null)

  useEffect(() => {
    const addNotification = (data, type) => {
      const notificationId = crypto.randomUUID()
      setNotifications(prev => [...prev, { notificationId, type, emitter: data.emitter, message: data.message }])
      setHasNotification(true)
    };

    socket.on('vaultShared', (data) => addNotification(data, 'vault'))
    socket.on('vaultDeleted', (data) => addNotification(data, 'vault'))
    socket.on('credentialAdded', (data) => addNotification(data, 'credential'))
    socket.on('credentialDeleted', (data) => addNotification(data, 'credential'))

    return () => {
      socket.off('vaultShared')
      socket.off('vaultDeleted')
      socket.off('credentialAdded')
      socket.off('credentialDeleted')
    }
  }, [])

  const handleToggle = (nextShow) => {
    if (nextShow) {
      setHasNotification(false);
    }
  };

  const popover = (
    <Popover id="popover-basic" role='button' style={{cursor:'default'}}>
      <Popover.Body>
        <ListGroup variant="flush">
          {notifications.map((ntf) => (
            <ListGroup.Item key={ntf.notificationId}>
              <Row>
                <Col xs="auto">
                  {ntf.type === 'vault' ? <VaultIcon/> : <FingerprintIcon/>}
                </Col>
                <Col>
                  <div className="fw-semibold">{ntf.emitter}</div>
                  <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {ntf.message}
                  </div>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
          {notifications.length === 0 && 
            <div className='d-flex justify-content-center align-items-center fs-6 text-secondary mb-3'>No notifications</div>
          }
        </ListGroup>
        <div className="d-flex justify-content-center gap-4 mt-3">
          <Button variant="primary" disabled={notifications.length === 0} size='sm'>
            <div className='d-flex justify-content-center align-items-center'>
              <RefreshIcon className=' me-1' style={{}}/>
              <span>Refresh vaults</span>
            </div>
          </Button>
          <Button variant='outline-danger' disabled={notifications.length === 0} 
          className='d-flex justify-content-center align-items-center'
          size='sm'
          > 
            <TrashIcon/> 
          </Button>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger 
    trigger="click" 
    placement="left-start" 
    overlay={popover}
    onToggle={handleToggle}
    ref={overlayRef} 
    rootClose
    >
      <div style={{ position: 'relative' }}>
        <div className={styles.bell}>
          <BellIcon/>
        </div>
        {hasNotification && (
          <span style={{
            position: 'absolute',
            top: 5,
            right: 37,
            width: 10,
            height: 10,
            backgroundColor: 'red',
            borderRadius: '50%'
            }}>
          </span>
        )}
      </div>
    </OverlayTrigger>
  );
};

export default BellPopover;
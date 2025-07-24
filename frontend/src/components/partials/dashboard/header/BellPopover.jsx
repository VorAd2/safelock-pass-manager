import { OverlayTrigger, Popover, ListGroup, Button, Row, Col, Image } from 'react-bootstrap';
import { BellIcon, RefreshIcon } from '../../../../assets/shared';
import { UserAvatar } from '../../../../assets/dashboard';
import styles from '../../../../styles/DashboardHeader.module.css';

const users = [
  { id: 1, name: 'João Silva', description: 'Administrador', avatar: '/avatar1.png' },
  { id: 2, name: 'Maria Costa', description: 'Editor', avatar: '/avatar2.png' },
  { id: 3, name: 'Pedro Souza', description: 'Visualizador', avatar: '/avatar3.png' },
];

const desc = 'Shared a vault with you'

const BellPopover = ({ disabledButton }) => {
  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <ListGroup variant="flush">
          {users.map((user) => (
            <ListGroup.Item key={user.id}>
              <Row>
                <Col xs="auto">
                  <UserAvatar/>
                </Col>
                <Col>
                  <div className="fw-semibold">{user.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {desc}
                  </div>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="d-flex justify-content-end mt-2">
          <Button variant="primary" disabled={disabledButton}>
            <div className='d-flex justify-content-center align-items-center'>
              <RefreshIcon className='mt-1 me-2' style={{}}/>
              <span>Refresh vaults</span>
            </div>
          </Button>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" placement="left-start" overlay={popover} rootClose>
      <div className={styles.bell}>
        <BellIcon/>
      </div>
    </OverlayTrigger>
  );
};

export default BellPopover;

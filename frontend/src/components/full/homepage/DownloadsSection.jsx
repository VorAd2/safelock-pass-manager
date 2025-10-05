import { useState } from 'react';
import { Container, Nav, Tab, Button } from 'react-bootstrap';
import styles from '../../../styles/HomePage.module.css';

export default function DownloadsSection() {
  const [key, setKey] = useState('windows');

  const downloadInfo = {
    windows: {
      title: 'Download for Windows',
      description: 'Version compatible with Windows 10 or higher.',
      link: '#',
    },
    macos: {
      title: 'Download for macOS',
      description: 'Compatible with macOS 11 Big Sur or higher.',
      link: '#',
    },
    linux: {
      title: 'Download for Linux',
      description: 'Available in .deb and .AppImage packages.',
      link: '#',
    },
  };

  return (
    <section id='downloads'>
      <Container fluid className="py-5 text-center bg-dark">
        <h2 className="mb-4 text-white" style={{ fontSize: '2.2rem' }}>Choose your system for download</h2>
        <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
          <div className={styles.downloadTabs}>
            <Nav variant="tabs" className="justify-content-center mb-4 fs-5" >
              <Nav.Item>
                <Nav.Link eventKey="windows">Windows</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="macos">macOS</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="linux">Linux</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          <Tab.Content className={styles.tabContent}>
            {Object.entries(downloadInfo).map(([os, info]) => (
              <Tab.Pane eventKey={os} key={os}>
                <h4>{info.title}</h4>
                <p>{info.description}</p>
                <Button variant='primary' className='fs-5' onClick={() => alert('Not implemented')}>Download Now</Button>
              </Tab.Pane>
            ))}
          </Tab.Content>

        </Tab.Container>
      </Container>
    </section>
  );
}
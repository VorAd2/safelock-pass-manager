import { useState } from 'react';
import { Container, Nav, Tab } from 'react-bootstrap';
import styles from '../../styles/HomePage.module.css';

export default function DownloadsSection() {
    const [key, setKey] = useState('windows');

    const downloadInfo = {
        windows: {
            title: 'Download para Windows',
            description: 'Versão compatível com Windows 10 ou superior.',
            link: '#',
        },
        macos: {
            title: 'Download para macOS',
            description: 'Compatível com macOS 11 Big Sur ou superior.',
            link: '#',
        },
        linux: {
            title: 'Download para Linux',
            description: 'Disponível em pacotes .deb e .AppImage.',
            link: '#',
        },
  };

    return (
      <section id='downloads'>
        <Container fluid className="py-5 text-center bg-dark">
          <h2 className="mb-4 text-white">Escolha seu sistema para download</h2>  
          <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
            <div className={styles.downloadTabs}>
                <Nav variant="tabs" className="justify-content-center mb-4">
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
                  <a href={info.link} className="btn btn-primary" download>
                    Baixar agora
                  </a>
                </Tab.Pane>
              ))}
            </Tab.Content>

          </Tab.Container>
        </Container>
      </section>
  );
}
import { Container, Row, Col, Button } from 'react-bootstrap';
import ArrowRightIcon from '../assets/features/arrow-right.svg?react';
import VaultIcon from '../assets/features/vault-icon.svg?react';
import CredentialIcon from '../assets/features/credential-icon.svg?react';
import PeopleIcon from '../assets/features/people-icon.svg?react';


export default function FeaturesSection() {
    return (
        <section id="features">
            <div className="container justify-items-center pt-5 pb-4">
                <h3>Tools & Features</h3>
                <hr className="my-2" />
            </div>
            <Container className='pb-5'>
                <Row className='align-items-center'>
                    <Col className='feature'>
                        <div className='feature-icon-back'>
                            <VaultIcon style={{fill: 'white'}} className='feature-icon'/>
                        </div>
                        <h4>Safe storage</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.</p>
                        <a href="#">Learn more <ArrowRightIcon/></a>
                    </Col>
                    <Col className='feature'>
                        <div className='feature-icon-back'>
                            <CredentialIcon style={{fill: 'white'}} className='feature-icon'/>
                        </div>
                        <h4>Credentials generator</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.</p>
                        <a href="#">Learn more  <ArrowRightIcon/></a>
                    </Col>
                    <Col className='feature'>
                        <div className='feature-icon-back'>
                            <PeopleIcon style={{fill: 'white'}} className='feature-icon'/>
                        </div>
                        <h4>Shareable data</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.</p>
                        <a href="#">Learn more  <ArrowRightIcon/></a>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
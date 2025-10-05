import { Container, Row } from 'react-bootstrap';
import FeatureCol from '../../partials/homepage/FeatureCol';
import { VaultIcon1, CredentialIcon1, PeopleIcon1 } from '../../../assets/features';


export default function FeaturesSection() {
    return (
        <section id="features" className='bg-light'>
            <div className="container justify-items-center pt-5 pb-4">
                <h2 style={{ fontSize: '2.2rem' }}>Tools & Features</h2>
                <hr className="my-2" style={{ height: "1.3px", border: 'none', backgroundColor: 'black' }} />
            </div>
            <Container className='pb-5'>
                <Row className='align-items-center'>
                    <FeatureCol
                        icon={VaultIcon1}
                        title="Safe storage"
                        description="Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua."
                    />
                    <FeatureCol
                        icon={CredentialIcon1}
                        title="Credentials generator"
                        description="Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua."
                    />
                    <FeatureCol
                        icon={PeopleIcon1}
                        title="Shareable data"
                        description="Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua."
                    />
                </Row>
            </Container>
        </section>
    );
}
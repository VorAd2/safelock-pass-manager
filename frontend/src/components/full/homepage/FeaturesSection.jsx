import { Container, Row} from 'react-bootstrap';
import FeatureCol from '../../partials/homepage/FeatureCol';
import VaultIcon from '../../../assets/features/vault-icon.svg?react';
import CredentialIcon from '../../../assets/features/credential-icon.svg?react';
import PeopleIcon from '../../../assets/features/people-icon.svg?react';


export default function FeaturesSection() {
    return (
        <section id="features">
            <div className="container justify-items-center pt-5 pb-4">
                <h2 style={{fontSize:'2.2rem'}}>Tools & Features</h2>
                <hr className="my-2" style={{height:"1.3px", border:'none', backgroundColor:'black'}}/>
            </div>
            <Container className='pb-5'>
                <Row className='align-items-center'>
                    <FeatureCol
                    icon={VaultIcon}
                    title="Safe storage"
                    description="Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua."
                    linkText="Learn more"
                    linkHref="#"
                    />
                    <FeatureCol
                    icon={CredentialIcon}
                    title="Credentials generator"
                    description="Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua."
                    linkText="Learn more"
                    linkHref="#"
                    />
                    <FeatureCol
                    icon={PeopleIcon}
                    title="Shareable data"
                    description="Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua."
                    linkText="Learn more"
                    linkHref="#"
                    />
                </Row>
            </Container>
        </section>
    );
}
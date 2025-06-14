import {
    Header, Footer, HeroSection, FeaturesSection, DownloadsSection, PrincingSection, ScrollTopBtn
} from '../components';
import { useEffect } from 'react';


export default function Home() {
    useEffect(() => {
        fetch('http://localhost:3001/')
            .then(res => res.text())
            .then(data => {console.log('Resposta do back: ', data)})
            .catch(err => {
                console.error('Erro na requisição: ', err)
            })
    }, []);

    return (
    <>
        <Header/>
            <HeroSection />
            <FeaturesSection/>
            <DownloadsSection/>
            <PrincingSection/>
            <ScrollTopBtn/>
        <Footer/>
        
    </>
       
    );
}
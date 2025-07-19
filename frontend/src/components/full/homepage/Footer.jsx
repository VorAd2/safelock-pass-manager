import GithubIcon from '../../../assets/shared/github.svg?react';
import styles from '../../../styles/HomePage.module.css';

export default function Footer() {
    return (
        <footer id="footer" className={`text-white py-4 mt-auto ${styles.myFooter} `} style={{backgroundColor:'var(--dark-blue-color)'}}>
            <div class="container text-center">
                <p class="mb-1">&copy; 2025 SafeLock. All rights reserved.</p>
                <a href="https://github.com/VorAd2" target='_blank'> <GithubIcon className='me-1'/>VorAd2 </a>
            </div>
        </footer>

     );
}
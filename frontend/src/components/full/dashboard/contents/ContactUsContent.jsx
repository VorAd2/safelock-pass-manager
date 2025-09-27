import { GitHubIcon } from '../../../../assets/shared'
import styled from 'styled-components'

const HoverA = styled.a`
        text-decoration: none;
        .githubIcon {
            width: 130px;
            height: 130px;
            fill: white; 
            transition: fill 0.1s ease-in-out;
        }
        p {
            color: white; 
            transition: color 0.1s ease-in-out;
            position: relative;
            padding-right: 0.7em;

            &::after {
                content: '↗'; 
                font-size: 0.65em;
                position: absolute;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
            }
        }

        &:hover {
            .githubIcon {
                fill: var(--lessdark-blue-color); 
            }
            p {
                color: var(--lessdark-blue-color);
            }
            cursor: pointer;
        }
    `

function ContactUsContent() {
    return (
        <div className='d-flex flex-grow-1 justify-content-center align-items-center'>
            <HoverA href='https://github.com/VorAd2' target='_blank' className='d-flex flex-column align-items-center'>
                <div className='d-flex justify-content-center'>
                    <GitHubIcon className='githubIcon' />
                </div>
                <p className='fs-2'>VorAd2</p>
            </HoverA>
        </div>
    )
}

export default ContactUsContent
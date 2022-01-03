import React from 'react'
import styled from 'styled-components'
import SafeSnipeLogo from '../assets/SafeSnipe-Emerald.png'
import { MdOutlineSpaceDashboard, MdOutlineAnalytics, MdOutlineAccountBalanceWallet, MdOutlineSettings, MdOutlineExitToApp } from 'react-icons/md'
import { RiRocket2Line } from 'react-icons/ri'
import { textWhite, primaryRed, backgroundLightBlue } from '../utils/index'

function Sidebar() {
    return <Container>
        <LogoContainer>
            <Logo src={SafeSnipeLogo} />
            <LogoText>SafeSnipe</LogoText>
        </LogoContainer>
        <LinksContainer>
            <Links>
                <Link>
                    <MdOutlineSpaceDashboard />
                    <h3>Dashboard</h3>
                </Link>
                <Link>
                    <RiRocket2Line />
                    <h3>Launch</h3>
                </Link>
                <Link>
                    <MdOutlineAnalytics />
                    <h3>Analytics</h3>
                </Link>
                <Link>
                    <MdOutlineAccountBalanceWallet />
                    <h3>Wallets</h3>
                </Link>
                <Link>
                    <MdOutlineSettings />
                    <h3>Settings</h3>
                </Link>
            </Links>
            <ExitContainer>
                <ExitLink>
                    <MdOutlineExitToApp />
                    <h3>Log Out</h3>
                </ExitLink>
            </ExitContainer>
        </LinksContainer>
    </Container>
}

const Container = styled.div`
    width: 20%;
    height: 100% !important;
    padding-left: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: left;
    gap: 3rem;
`;

const LogoContainer = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;  
    margin-top: 2rem;
`;

const Logo = styled.img`
    height: 3rem;
`;

const LogoText = styled.h2`
    color: ${textWhite};
    font: 1.5rem;
    margin-left: 1rem;
    margin-bottom: -0.2rem;
`;

const LinksContainer = styled.div`
    width: 100%;
    height: 100%;
    margin-left: -.5rem;
`;

const Links = styled.div`
    list-style-type: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Link = styled.div`
    padding: 1rem 0 1rem 1.5rem;
    margin: .5rem 0 .5rem 0;
    border-radius: 1rem;
    display: flex;
    gap: 1rem;
    color: ${ textWhite };
    cursor: pointer;
    transition: 0.2s ease-in-out;
    h3 {
        font-weight: 400;
    }
    svg {
        font-size: 1.25rem;
        margin-top: 0.15rem;
    }
    &:hover {    
        background: ${backgroundLightBlue};
    }
    &:active {    
        background: ${backgroundLightBlue};
    }
`;

const ExitContainer = styled.div`
    list-style-type: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 3rem;
`;

const ExitLink = styled.div`
    padding: 1rem 0 1rem 1.5rem;
    margin: .5rem 0 .5rem 0;
    border-radius: 1rem;
    display: flex;
    gap: 1rem;
    color: ${ primaryRed };
    cursor: pointer;
    transition: 0.2s ease-in-out;
    h3 {
        font-weight: 400;
    }
    svg {
        font-size: 1.25rem;
        margin-top: 0.15rem;
    }
    &:hover {    
        background: ${backgroundLightBlue};
    }
    &:active {    
        background: ${backgroundLightBlue};
    }
`;

//const LinksContainer = styled.div``;

export default Sidebar

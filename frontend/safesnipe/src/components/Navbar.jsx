import React from 'react'
import styled from 'styled-components'
import { MdSearch } from 'react-icons/md'
import { textWhite, backgroundDarkBlue } from '../utils'

function Navbar() {
    return <NavbarContainer>
        <Text>Launch</Text>
        <InputContainer>
            <Icon>
                <MdSearch />
            </Icon>
            <Input type="text" placeholder="Search for presales..." />
        </InputContainer>
    </NavbarContainer>
}

const NavbarContainer = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 10%;
`;

const Text = styled.h1`
    font: 1.5rem;
    color: ${ textWhite };
`;

const InputContainer = styled.div`
    display: flex;
`;

const Icon = styled.div`
    height: 2.5rem;
    width: 3rem;
    background-color: ${ backgroundDarkBlue };
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: .75rem;
    border-bottom-left-radius: .75rem;
    svg {
        color: ${ textWhite };
    }
`;

const Input = styled.input`
    border: none;
    background-color: ${ backgroundDarkBlue };
    color: ${ textWhite };
    border-top-right-radius: .75rem;
    border-bottom-right-radius: .75rem;
    &:focus {
        border: none;
        outline: none;
    }
    ::placeholder {
        color: #A9A9A9;
    }
`;


export default Navbar

import React from 'react'
import styled from 'styled-components'
import { MdVerified } from "react-icons/md"
import { AiOutlineAudit } from "react-icons/ai"
import { backgroundDarkBlue, backgroundRegularBlue, hoverEffect, primaryBlue, primaryEmerald, textWhite } from "../../utils"

function formatDateString(date) {
    const d = new Date(date);

    return d.getUTCDate() + "/" + (d.getUTCMonth() + 1) + "/" + d.getUTCFullYear();
}

function getValidImage(url) {
    if(/(http(s?)):\/\//i.test(url)) {
        return url
    } else {
        return "https://i.imgur.com/g13I5Xz.png"
    }

}

function TopLaunches({ data }) {

    return <LaunchesCard>
        <CardContent>
            <LaunchTable>
                <thead>
                    <LaunchTRSticky>
                        <LaunchTH></LaunchTH>
                        <LaunchTH>Symbol</LaunchTH>
                        <LaunchTH>Launch</LaunchTH>
                        <LaunchTH>Telegram Users</LaunchTH>
                        <LaunchTH>Max Buy</LaunchTH> 
                    </LaunchTRSticky>
                </thead>
                <tbody>
                    {
                        data.launches && data.launches.map((launch) => (
                            <LaunchTR>
                                <LaunchTD><LaunchIcon src={getValidImage(launch.tokenIconUrl)}/></LaunchTD>
                                <LaunchTD>{ launch.tokenSymbol } { launch.hasKYC && <MdVerifiedStyled /> } { launch.hasAudit && <AiOutlineAuditStyled /> }</LaunchTD>
                                <LaunchTD>{ formatDateString(launch.presaleStart) }</LaunchTD>
                                <LaunchTD>{ launch.telegramUsers }</LaunchTD>
                                <LaunchTD>{ launch.maxBuy }</LaunchTD>        
                            </LaunchTR>
                        ))
                    }
                </tbody>
            </LaunchTable> 
        </CardContent>
    </LaunchesCard>
}

const LaunchesCard = styled.div`
    margin-top: 1rem;
    padding-top: 0 !important;
    // height: 100%;
    overflow: auto;
    background-color: ${backgroundDarkBlue};
    padding: 1.5rem 2rem;
    border-radius: .5rem;
    color: ${textWhite};
    transition: 0.4s ease-in-out;
    &:hover {
        box-shadow: ${hoverEffect};
    }

    &::-webkit-scrollbar {
        width: 1rem;
    }
     
    &::-webkit-scrollbar-thumb {
        border: .4rem solid rgba(0, 0, 0, 0);
        background-clip: padding-box;
        border-radius: 9999px;
        background-color: ${primaryEmerald};
    }
`;

const CardContent = styled.div`
`;

const LaunchTable = styled.table`
    width: 100%;
    height: 100%;
    border-spacing: 0;
    padding: 0;
`;

const LaunchTR = styled.tr`
    text-align: center;
`;

const LaunchTRSticky = styled.tr`
    text-align: center;
    position: sticky; 
    top: -1px; 
    background-color: ${backgroundDarkBlue};
`;

const LaunchTH = styled.th`
    padding-bottom: .5rem !important;
    padding-top: 1.2rem !important;
`;

const LaunchTD = styled.td`
    border-top: 1px solid ${backgroundRegularBlue};
    padding-top: .5rem !important;
    padding-bottom: .5rem !important;
`;

const LaunchIcon = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 100%;
    vertical-align:middle;
`;

const MdVerifiedStyled = styled(MdVerified)`
    vertical-align: middle;
    color: ${primaryEmerald}
`;

const AiOutlineAuditStyled = styled(AiOutlineAudit)`
    vertical-align: middle;
    color: ${primaryBlue}
`;

export default TopLaunches

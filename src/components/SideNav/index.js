import React from 'react'
import styled from 'styled-components'

import Title from '../Title'
import { BasicLink1 } from '../Link'
import { useMedia } from 'react-use'
import { transparentize } from 'polished'
import { TYPE } from '../../Theme'
import { withRouter } from 'react-router-dom'

import Link from '../Link'
import { useSessionStart } from '../../contexts/Application'
import { useLightModeManager } from '../../contexts/LocalStorage'
import Toggle from '../Toggle'

import { useLatestBlocks } from '../../contexts/Application'

const Wrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  height: 60px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => transparentize(0.4, theme.bg7)};
  color: ${({ theme }) => theme.text8};
  padding-left: 16px;
  padding-right: 16px;
  box-sizing: border-box;
  border-bottom: solid 1px rgba(205, 117, 76, 0.1);
`

const DesktopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  
  top: 0px;
  left: 0px;
  height: 60px;
  width: 100%;
  padding-left: 16px;
  padding-right: 32px;
  overflow: hidden;
  
`

const MobileWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  top: 0px;
  left: 0px;
  height: 60px;
  width: 100%;
  padding-left: 0px;
  padding-right: 0px;
  overflow: hidden;
`

const Polling = styled.div`
  
  display: flex;
  
  opacity: 0.4;
  transition: opacity 0.25s ease;
  :hover {
    opacity: 1;
  }

  align-items: center;
  justify-content: space-between;
`
const PollingDot = styled.div`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  
  border-radius: 50%;
  background-color: ${({ theme }) => theme.green1};

  align-items: center;
  justify-content: space-between;
`

const HeaderText = styled.div`
  font-size: 20px;
  font-weight: 500;
  display: inline-box;
  display: -webkit-inline-box;
  align-items: center;
  opacity: 0.8;
  :hover {
    opacity: 1;
  }
  a {
    color: ${({ theme }) => theme.text8};
  }
`

const HeaderText1 = styled.div`
  font-size: 0.825rem;
  font-weight: 500;
  display: inline-box;
  display: -webkit-inline-box;
  opacity: 0.8;
  :hover {
    opacity: 1;
  }
  a {
    color: ${({ theme }) => theme.text8};
  }
`

const Nav1 = styled.div`
  display: flex;
  top: 0;
  margin-left: 24px;
  margin-right: 24px;
  width: 348px;
  height: 60px;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.text8};
`

const Nav2 = styled.div`
  display: flex;
  top: 0;
  margin-right: 32px;
  margin-left: 24px;
  width: 192px;
  height: 60px;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.text8};
`

const Nav3 = styled.div`
  display: flex;
  top: 0;
  margin-left: 24px;
  width: 128px;
  height: 60px;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
`

function SideNav({ history }) {
  const below1080 = useMedia('(max-width: 1080px)')

  const below1180 = useMedia('(max-width: 1180px)')

  const seconds = useSessionStart()

  const [isLight, toggleLightMode] = useLightModeManager()

  const [latestBlock] = useLatestBlocks()

  return (
    <Wrapper isMobile={below1080}>
      {!below1080 ? (
        <DesktopWrapper>
           <Title />
           <Nav1>
            <HeaderText>             
            <BasicLink1 to="/overview">
             Overview
            </BasicLink1>
            </HeaderText>
            <HeaderText> 
            <BasicLink1 to="/pools">
             Pools  
            </BasicLink1>
            </HeaderText>
            <HeaderText>         
            <BasicLink1 to="/tokens">
             Tokens 
            </BasicLink1>
            </HeaderText>
            <HeaderText> 
            <BasicLink1 to="/accounts">
             Accounts  
            </BasicLink1>
            </HeaderText>
           </Nav1>
           <Polling>
              <TYPE.medium marginRight={'8px'} marginBottom={'2px'} alignItems={'center'}>
                Latest synced block:
              </TYPE.medium>
              <PollingDot />
               <a href="/">
                <TYPE.nav marginLeft={'8px'}>
                {`${latestBlock}`}
                </TYPE.nav>
               </a>
            </Polling>
           <Nav2> 
            <HeaderText> 
             <Link href="https://exchange.anpanswap.finance/#/swap" target="_blank">
              Launch App
             </Link>
            </HeaderText>
            <Toggle isActive={isLight} toggle={toggleLightMode} />
           </Nav2>
        </DesktopWrapper>
      ) : (
        <MobileWrapper>
         <Title />
         <Nav3>
          <HeaderText1>  
           <Link href="https://exchange.anpanswap.finance/#/swap" target="_blank">
            App
           </Link>
           </HeaderText1> 
          <Toggle isActive={isLight} toggle={toggleLightMode} />
         </Nav3>
        </MobileWrapper>
      )}
    </Wrapper>
  )
}

export default withRouter(SideNav)

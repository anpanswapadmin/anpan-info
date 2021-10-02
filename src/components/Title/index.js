import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Flex } from 'rebass'
import Link from '../Link'
import { RowFixed } from '../Row'
import { useLightModeManager } from '../../contexts/LocalStorage'
import Logo from '../../assets/logo-white.png'
import logo from '../../assets/logo-black.png'

const TitleWrapper = styled.div`
  text-decoration: none;
  
  &:hover {
    cursor: pointer;
  }
  align-items: center;
  z-index: 10;
`

const UniIcon = styled(Link)`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
  align-items: center;
`

export default function Title() {
  const history = useHistory()
  const [lightMode] = useLightModeManager()

  return (
    <TitleWrapper onClick={() => history.push('/')}>
      <Flex alignItems="center">
        <RowFixed>
          <UniIcon id="link" onClick={() => history.push('/')}>
            <img width={'150px'} src={lightMode ? logo : Logo} alignItems="center" alt="logo" />
          </UniIcon>
        </RowFixed>
      </Flex>
    </TitleWrapper>
  )
}

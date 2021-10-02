import React, { useState } from 'react'
import styled from 'styled-components'
import { ApolloProvider } from 'react-apollo'
import { client } from './apollo/client'
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'
import GlobalPage from './pages/GlobalPage'
import TokenPage from './pages/TokenPage'
import PairPage from './pages/PairPage'
import { useGlobalData, useGlobalChartData } from './contexts/GlobalData'
import { isAddress } from './utils'
import AccountPage from './pages/AccountPage'
import AllTokensPage from './pages/AllTokensPage'
import AllPairsPage from './pages/AllPairsPage'
import PinnedData from './components/PinnedData'

import SideNav from './components/SideNav'
import AccountLookup from './pages/AccountLookup'
import { OVERVIEW_TOKEN_BLACKLIST, PAIR_BLACKLIST } from './constants'
import LocalLoader from './components/LocalLoader'


const AppWrapper = styled.div`
  position: relative;
  top: 60px;
  width: 100%;
`
const ContentWrapper = styled.div`
  top: 60px;
  display: grid;
  grid-template-columns: ${({ open }) => (open ? '1fr 220px' : '1fr 64px')}; 
  
  @media screen and (max-width: 1236px) {
    grid-template-columns: 1fr;
  }

  @media screen and (max-width: 1080px) {
    grid-template-columns: 1fr;
    max-width: 100vw;
    overflow: hidden;
    grid-gap: 0;
  }
`

const Right = styled.div`
  position: relative;
  top: 60px:
  right: 0px;
  
  width: ${({ open }) => (open ? '220px' : '64px')};
  overflow: auto;
  background-color: ${({ theme }) => theme.bg1};
  @media screen and (max-width: 1236px) {
    display: none;
  }
`

const Center = styled.div`
  top: 60px;  
  height: 100%;
  z-index: 9999;
  transition: width 0.25s ease;
  background-color: ${({ theme }) => theme.onlyLight};
`



/**
 * Wrap the component with the header and sidebar pinned tab
 */
const LayoutWrapper = ({ children, savedOpen, setSavedOpen }) => {
  return (
    <>
      <SideNav/>
      <ContentWrapper open={savedOpen}>
        
        <Center id="center">{children}</Center>
        <Right open={savedOpen}>
          <PinnedData open={savedOpen} setSavedOpen={setSavedOpen} />
        </Right>
      </ContentWrapper>
    </>
  )
}



function App() {
  const [savedOpen, setSavedOpen] = useState(false)

  const globalData = useGlobalData()
  const globalChartData = useGlobalChartData()
  

  // show warning
  

  return (
    <ApolloProvider client={client}>
      <AppWrapper>
        
      {globalData &&
        Object.keys(globalData).length > 0 &&
        globalChartData &&
        Object.keys(globalChartData).length > 0 ? (
          <BrowserRouter>
            <Switch>
              <Route
                exacts
                strict
                path="/token/:tokenAddress"
                render={({ match }) => {
                  if (OVERVIEW_TOKEN_BLACKLIST.includes(match.params.tokenAddress.toLowerCase())) {
                    return <Redirect to="/overview" />
                  }
                  if (isAddress(match.params.tokenAddress.toLowerCase())) {
                    return (
                      <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                        <TokenPage address={match.params.tokenAddress.toLowerCase()} />
                      </LayoutWrapper>
                    )
                  } else {
                    return <Redirect to="/overview" />
                  }
                }}
              />
              <Route
                exacts
                strict
                path="/pool/:pairAddress"
                render={({ match }) => {
                  if (PAIR_BLACKLIST.includes(match.params.pairAddress.toLowerCase())) {
                    return <Redirect to="/overview" />
                  }
                  if (isAddress(match.params.pairAddress.toLowerCase())) {
                    return (
                      <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                        <PairPage pairAddress={match.params.pairAddress.toLowerCase()} />
                      </LayoutWrapper>
                    )
                  } else {
                    return <Redirect to="/overview" />
                  }
                }}
              />
              <Route
                exacts
                strict
                path="/account/:accountAddress"
                render={({ match }) => {
                  if (isAddress(match.params.accountAddress.toLowerCase())) {
                    return (
                      <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                        <AccountPage account={match.params.accountAddress.toLowerCase()} />
                      </LayoutWrapper>
                    )
                  } else {
                    return <Redirect to="/overview" />
                  }
                }}
              />

              <Route path="/overview">
                <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                  <GlobalPage />
                </LayoutWrapper>
              </Route>

              <Route path="/tokens">
                <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                  <AllTokensPage />
                </LayoutWrapper>
              </Route>

              <Route path="/pools">
                <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                  <AllPairsPage />
                </LayoutWrapper>
              </Route>

              <Route path="/accounts">
                <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                  <AccountLookup />
                </LayoutWrapper>
              </Route>

              <Redirect to="/overview" />
            </Switch>
          </BrowserRouter>
        ) : (
          <LocalLoader fill="true" />
        )}
      </AppWrapper>
    </ApolloProvider>
  )
}

export default App

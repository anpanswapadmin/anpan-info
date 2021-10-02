import React from 'react'
import { ThemeProvider as StyledComponentsThemeProvider, createGlobalStyle } from 'styled-components'
import { useLightModeManager } from '../contexts/LocalStorage'
import styled from 'styled-components'
import '@fontsource/dm-sans/index.css'
import { Text } from 'rebass'

export default function ThemeProvider({ children }) {
  const [lightMode] = useLightModeManager()

  return <StyledComponentsThemeProvider theme={theme(lightMode)}>{children}</StyledComponentsThemeProvider>
}

const theme = (lightMode, color) => ({
  customColor: color,
  textColor: lightMode ? '#140A06' : color,

  panelColor: lightMode ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0)',
  backgroundColor: lightMode ? '#faf0eb' : '#140A06',

  // linkscolor: lightMode ? '#140A06' : '#0080FF',
  linkscolor: lightMode ? '#140A06' : '#0080FF',

  concreteGray: lightMode ? '#fffdfa' : '#3B1D12',
  inputBackground: lightMode ? '#fffdfa' : '#211c1c',
  shadowColor: lightMode ? '#0080FF' : '#000',
  mercuryGray: lightMode ? '#efd1c3' : '#392d2d',

  text1: lightMode ? '#CD754C' : '#fffdfa',
  text2: lightMode ? '#8d4625' : '#d2c6c6',
  text3: lightMode ? '#d4835e' : '#c96436',
  text4: lightMode ? '#d2c6c6' : '#8d4625',
  text5: lightMode ? '#f4f1f1' : '#512815',
  text6: lightMode ? '#000' : '#c96436',
  text7: lightMode ? '#eac2ae' : '#595959',
  text8: lightMode ? '#CD754C' : '#f5AE70',

  // special case text types
  white: '#FFFFFF',
  back: '#000000',

  // backgrounds / greys
  bg1: lightMode ? '#fffdfa' : '#2b2222',
  bg2: lightMode ? '#fbf9f9' : '#512815',
  bg3: lightMode ? '#f4f1f1' : '#473838',
  bg4: lightMode ? '#e0d1d1' : '#8d4625',
  bg5: lightMode ? '#d4835e' : '#8d4625',
  bg6: lightMode ? '#FFFFFF' : '#000',
  bg7: lightMode ? '#FFFFFF' : '#62351d',
  bg8: lightMode ? '#f0d1c2' : '#2b2222',

  //specialty colors
  modalBG: lightMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.85)',
  advancedBG: lightMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.1)',
  onlyLight: lightMode ? '#faf0eb' : '#1f1414',
  divider: lightMode ? 'rgba(43, 43, 43, 0.035)' : 'rgba(43, 43, 43, 0.435)',

  //primary colors
  primary1: lightMode ? '#0080FF' : '#2172E5',
  primary2: lightMode ? '#FF8CC3' : '#3680E7',
  primary3: lightMode ? '#FF99C9' : '#4D8FEA',
  primary4: lightMode ? '#F6DDE8' : '#376bad70',
  primary5: lightMode ? '#FDEAF1' : '#153d6f70',

  // color text
  primaryText1: lightMode ? '#0080FF' : '#6da8ff',

  // secondary colors
  secondary1: lightMode ? '#0080FF' : '#2172E5',
  secondary2: lightMode ? '#F6DDE8' : '#17000b26',
  secondary3: lightMode ? '#FDEAF1' : '#17000b26',

  shadow1: lightMode ? '#0080FF' : '#000',

  // other
  red1: '#FF6871',
  green1: '#27AE60',
  yellow1: '#FFE270',
  yellow2: '#F3841E',
  link: '#0080FF',
  blue: '2f80ed',

  background: lightMode ? `radial-gradient(50% 50% at 50% 50%, #0080FF 30 0%, #fff 0%)` : '#140A06',
})

const TextWrapper = styled(Text)`
  color: ${({ color, theme }) => theme[color]};
`

export const TYPE = {
  main(props) {
    return <TextWrapper fontWeight={500} fontSize={14} color={'text1'} {...props} />
  },

  body(props) {
    return <TextWrapper fontWeight={400} fontSize={14} color={'text1'} {...props} />
  },

  small(props) {
    return <TextWrapper fontWeight={500} fontSize={11} color={'text1'} {...props} />
  },

  header(props) {
    return <TextWrapper fontWeight={600} color={'text1'} {...props} />
  },

  largeHeader(props) {
    return <TextWrapper fontWeight={500} color={'text1'} fontSize={24} {...props} />
  },

  light(props) {
    return <TextWrapper fontWeight={400} color={'text3'} fontSize={14} {...props} />
  },

  pink(props) {
    return <TextWrapper fontWeight={props.faded ? 400 : 600} color={props.faded ? 'text1' : 'text1'} {...props} />
  },
  medium(props) {
    return <TextWrapper fontWeight={500} fontSize={18} color={'text8'} {...props} />
  },
  nav(props) {
    return <TextWrapper fontWeight={500} fontSize={14} color={'text8'} {...props} />
  },
}

export const Hover = styled.div`
  :hover {
    cursor: pointer;
  }
`

export const Link = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
  :hover {
    text-decoration: underline;
  }
  :focus {
    outline: none;
    text-decoration: underline;
  }
  :active {
    text-decoration: none;
  }
`

export const ThemedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  max-width: 100vw !important;
  height: 200vh;
  mix-blend-mode: color;
  background: ${({ backgroundColor }) =>
    `radial-gradient(50% 50% at 50% 50%, ${backgroundColor} 0%, rgba(255, 255, 255, 0) 100%)`};
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 9999;

  transform: translateY(-110vh);
`

export const GlobalStyle = createGlobalStyle`
  @import url('https://rsms.me/inter/inter.css');
  html { font-family: 'DM Sans', sans-serif; }
  @supports (font-variation-settings: normal) {
    html { font-family: 'DM Sans', sans-serif; }
  }

  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-size: 14px;
    background-color: ${({ theme }) => theme.bg6};
  }

  a {
    text-decoration: none;

    :hover {
      text-decoration: none
    }
  }


.three-line-legend {
	width: 100%;
	height: 70px;
	position: absolute;
	padding: 8px;
	font-size: 12px;
	color: #20262E;
	background-color: rgba(255, 255, 255, 0.23);
	text-align: left;
	z-index: 10;
  pointer-events: none;
}

.three-line-legend-dark {
	width: 100%;
	height: 70px;
	position: absolute;
	padding: 8px;
	font-size: 12px;
	color: white;
	background-color: rgba(255, 255, 255, 0.23);
	text-align: left;
	z-index: 10;
  pointer-events: none;
}

@media screen and (max-width: 800px) {
  .three-line-legend {
    display: none !important;
  }
}

.tv-lightweight-charts{
  width: 100% !important;


  & > * {
    width: 100% !important;
  }
}


  html {
    font-size: 1rem;
    font-variant: none;
    color: '#140A06';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    height: 100%;
  }
`

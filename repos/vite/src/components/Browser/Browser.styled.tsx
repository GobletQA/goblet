import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  dims,
  colors,
  getColor,
  IconButton
} from '@gobletqa/components'

export const BrowserStateIcon = styled(Box)``

export const BrowserNav = styled('nav')(({ theme }) => `
  width: 100%;
  display: flex;
  padding: 2px 0;
  place-items: center;
  place-content: center;
  height: ${dims.browser.nav.hpx};
  background-color: ${getColor(colors.gray01, colors.black09, theme)};
`)

export const BrowserNavActions = styled(Box)(({ theme }) => `
  flex-grow: 0;
  display: flex;
  min-width: 102px;
  padding-left: 6px;
  align-items: center;
  justify-content: space-around;
`)

export const BrowserInput = styled('input')(({ theme }) => `
  flex-grow: 1;
  border: none;
  height: ${dims.browser.url.hpx};
  margin: 0 6px;
  font-size: 14px;
  padding: 0 14px;
  line-height: 22px;
  border-radius: 18px;
  font-family: inherit;
  letter-spacing: 0.2px;
  color: ${getColor(colors.black07, colors.white, theme)};
  background-color: ${getColor(colors.white00, colors.black12, theme)};

  &:focus {
    outline: 2px solid ${colors.royalPurple};
  }
`)

export const BrowserContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  display: block;
  flex-basis: auto;
  position: relative;
  box-sizing: border-box;
  background-color: ${getColor(colors.gray00, colors.black15, theme)};
  
  &.recording {
    
  }

  &.playing {
    
  }

`)

export const BrowserViewContainer = styled(Box)`
  display: flex;
  position: relative;
  align-items: stretch;
  height: calc( 100% - ${dims.browser.nav.hpx} );

  // @novnc does some automatic re-alignment
  // That causes the browser to jump on focus
  // When if it goes out of the screen view
  // 
  // The 100% - browser.nav.height should be correct
  // But for some reason, that still causes it to jump
  // So we subtract an extra 5px to fix it
  // Not sure where it get's the 5px from, maybe a rounding error?
  max-height: calc( 100% - ${dims.browser.nav.height + 5}px );
`

export const BrowserView = styled('div')`
  min-width: 100%;
  text-size-adjust: 100%;
  box-sizing: border-box;
  font-smoothing: antialiased;
  
  & > div {
    background-color: ${colors.gray08} !important;
  }

  
  & canvas {
    // NoVNC sets the margin style directly on the canvas element
    // So we have to use important to override it
    margin-top: 0px !important;
  }
`

export const BrowserBtn = styled(IconButton)(({ theme }) => `
  width: 20px;
  height: 20px;
  display: flex;
  border-radius: 50%;
  place-items: center;
  font-family: inherit;
  place-content: center;
  background-color: transparent;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  color: ${getColor(colors.gray12, colors.white, theme)};
  
  &.override-color:hover {
    color: ignore;
  }

  &:disabled: {
    color: ${colors.fadeLight25};
  }
`)


export const BrowserShadowTop = styled(Box)`
  width:100%;
  z-index: 10;
  position: absolute;
  pointer-events: none;
  top: -${dims.browser.nav.hpx};
  height: ${dims.browser.nav.height - 12}px;
  transition: box-shadow 300ms ease;
  box-shadow: 0px 10px 15px transparent;
  
  &.playing {
    box-shadow: 0px 10px 15px ${colors.purple10};
  }

  &.recording {
    box-shadow: 0px 10px 15px ${colors.recordRed};
  }
`
export const BrowserShadowBottom = styled(Box)`
  width:100%;
  z-index: 10;
  position: absolute;
  pointer-events: none;
  bottom: -${dims.browser.nav.hpx};
  height: ${dims.browser.nav.height - 12}px;
  transition: box-shadow 300ms ease;
  box-shadow: 0px -10px 15px transparent;

  &.playing {
    box-shadow: 0px -10px 15px ${colors.purple10};
  }

  &.recording {
    box-shadow: 0px -10px 15px ${colors.recordRed};
  }
`
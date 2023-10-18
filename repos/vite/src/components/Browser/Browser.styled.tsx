import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  Text,
  dims,
  colors,
  gutter,
  getColor,
  IconButton,
  AdsClickIcon
} from '@gobletqa/components'

export const BrowserNav = styled('nav')(({ theme }) => `
  width: 100%;
  display: flex;
  padding: 2px 0;
  align-items: center;
  place-items: center;
  place-content: center;
  height: ${dims.browser.nav.hpx};
  background-color: ${getColor(colors.purple00, colors.black09, theme)};
  border-bottom: 1px solid ${getColor(colors.gray00, colors.black12, theme)};
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
  margin: 0 6px;
  font-size: 14px;
  padding: 0 14px;
  line-height: 22px;
  position: relative;
  border-radius: 18px;
  font-family: inherit;
  letter-spacing: 0.2px;
  height: ${dims.browser.url.hpx};
  color: ${getColor(colors.black07, colors.white, theme)};
  outline: 1px solid ${getColor(colors.gray00, colors.black11)};
  background-color: ${getColor(colors.white, colors.black12, theme)};

  &:focus {
    outline: 2px solid ${colors.royalPurple};
  }
`)

export const BrowserContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: calc( 100% - ${dims.browser.actions.hpx} );
  max-height: calc( 100% - ${dims.browser.actions.hpx} );
  
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
  max-height: calc( 100% - ${dims.browser.nav.hpx} );
`

export const BrowserView = styled('div')(({ theme }) => {
  return `
    min-width: 100%;
    text-size-adjust: 100%;
    box-sizing: border-box;
    font-smoothing: antialiased;
    
    & > div {
      background-color: ${colors.gray05} !important;
    }

    
    & canvas {
      // NoVNC sets the margin style directly on the canvas element
      // So we have to use important to override it
      margin-top: 0px !important;
      box-shadow: ${theme.shadows[4]};
    }
  `
})

export const BrowserBtn = styled(IconButton)(({ theme }) => `
  width: 20px;
  height: 20px;
  display: flex;
  border-radius: 50%;
  place-items: center;
  font-family: inherit;
  place-content: center;
  background-color: transparent;
  color: ${getColor(colors.gray12, colors.white, theme)};
  transition: background-color ${dims.trans.avg} ease-in-out, color ${dims.trans.avg} ease-in-out;
  
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
  opacity: 0.75;
  position: absolute;
  pointer-events: none;
  top: -${dims.browser.nav.height - 10}px;
  height: ${dims.browser.nav.height - 12}px;
  transition: box-shadow ${dims.trans.avgEase};
  box-shadow: 0px 10px 14px transparent;
  
  &.playing {
    box-shadow: 0px 2px 0px ${colors.purple10};
  }

  &.recording {
    box-shadow: 0px 2px 0px ${colors.recordRed};
  }
`
export const BrowserShadowBottom = styled(Box)`
  width:100%;
  z-index: 10;
  opacity: 0.75;
  position: absolute;
  pointer-events: none;
  bottom: -${gutter.margin.px};
  box-shadow: 0px -3px 0px transparent;
  height: ${dims.browser.nav.height - 12}px;
  transition: box-shadow ${dims.trans.avgEase};

  &.playing {
    box-shadow: 0px -3px 0px ${colors.purple10};
  }

  &.recording {
    box-shadow: 0px -3px 0px ${colors.recordRed};
  }
`

export const BrowserCoverClick = styled(Box)`
  display: flex;
  top: ${dims.browser.nav.hpx};
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  
  &.follow {
    cursor: pointer;
  }

  &.playing {
    cursor: wait;
  }

  &:hover {
    .gb-browser-mouse-follow {
      opacity: 1 !important;
    }
  }
`

export const BrowserMouseContainer = styled(Box)`
  display: flex;
  padding: 4px 8px;
  border-radius: 4px;
  color: ${colors.white};
  background-color: ${colors.fadeDark70};
`

export const BrowserMouseIcon = styled(AdsClickIcon)`
 font-size: 14px;
`

export const BrowserMouseText = styled(Text)`
  font-size: 12px;
  margin-left: ${gutter.margin.qpx};
`
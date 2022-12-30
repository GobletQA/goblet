import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  dims,
  colors,
  getColor,
  IconButton
} from '@gobletqa/components'


export const BrowserNav = styled('nav')(({ theme }) => `
  width: 100%;
  display: flex;
  padding: 2px 0;
  place-items: center;
  place-content: center;
  height: ${dims.browser.nav.hpx};
  background-color: ${getColor(colors.gray01, colors.black09, theme)};

  div:not(:first-of-type) {
    padding: 0 4px;
    justify-content: left;
    height: ${dims.browser.url.height}px;

    button {
      margin-right: 4px;
      margin-bottom: 4px;
    }
  }
`)

export const BrowserInput = styled('input')(({ theme }) => `
  width: 100%;
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
  background-color: ${getColor(colors.gray02, colors.black12, theme)};

  &:focus {
    outline: 2px solid ${colors.royalPurple};
  }
`)

export const BrowserContainer = styled(Box)(({ theme }) => `
  padding-top: 2px;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  display: block;
  flex-basis: auto;
  position: relative;
  box-sizing: border-box;
  background-color: ${getColor(colors.gray00, colors.black15, theme)};
`)

export const BrowserViewContainer = styled(Box)`
  display: flex;
  position: relative;
  align-items: stretch;
  height: calc( 100% - ${dims.browser.nav.hpx} );
  max-height: calc( 100% - ${dims.browser.nav.hpx} );
`

export const BrowserView = styled('div')`
  min-width: 100%;
  text-size-adjust: 100%;
  box-sizing: border-box;
  font-smoothing: antialiased;
  
  canvas {
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

  &:disabled: {
    color: ${colors.fadeLight25};
  }
`)

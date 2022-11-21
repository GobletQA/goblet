import Box from '@mui/material/Box'
import { colors, dims } from '@theme'
import { styled } from '@mui/material/styles'
import { getColor } from '@utils/theme/getColor'
import { IconButton } from '@components/Buttons/IconButton'

export const BrowserNav = styled('nav')(({ theme }) => `
  width: 100%;
  display: flex;
  padding: 2px 0;
  place-items: center;
  place-content: center;
  height: ${dims.browser.nav.hpx};
  border-bottom: 1px solid ${getColor(colors.gray04, colors.black04, theme)};
  background-color: ${getColor(colors.gray02, colors.black05, theme)};

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
  height: 26px;
  margin: 0 6px;
  font-size: 14px;
  padding: 0 14px;
  line-height: 26px;
  border-radius: 18px;
  font-family: inherit;
  letter-spacing: 0.2px;
  color: ${getColor(colors.black04, colors.white00, theme)};
  background-color: ${getColor(colors.gray04, colors.black02, theme)};

  &:focus {
    outline: 2px solid ${colors.royalPurple};
  }
`)

export const BrowserContainer = styled(Box)`
  width: 100%;
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  display: block;
  flex-basis: auto;
  position: relative;
  box-sizing: border-box;
`

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
  color: ${getColor(colors.gray08, colors.white00, theme)};

  &:disabled: {
    color: ${colors.fade25};
  }
`)
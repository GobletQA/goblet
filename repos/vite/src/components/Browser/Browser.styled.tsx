import Box from '@mui/material/Box'
import { colors, dims } from '@theme'
import { styled } from '@mui/material/styles'

export const BrowserNav = styled('nav')(({ theme }) => `
  width: 100%;
  display: flex;
  padding: 4px 0;
  place-items: center;
  place-content: center;
  height: ${dims.browser.nav.hpx};
  border-bottom: 1px solid rgba(0,0,0, 0.20);
  background-color: ${colors.monacoBackground};

  div:not(:first-of-type) {
    padding: 0 8px;
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
  height: 28px;
  margin: 0 6px;
  font-size: 14px;
  padding: 0 13px;
  line-height: 26px;
  border-radius: 18px;
  font-family: inherit;
  letter-spacing: 0.2px;
  color: rgb(255, 255, 255);
  background-color: ${colors.monacoBorder};

  &:focus {
    outline: 2px solid rgb(138, 180, 248);
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
`
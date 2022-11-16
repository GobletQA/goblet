import { styled } from '@mui/material/styles'
import { colors } from '@theme'

export const BrowserNav = styled('nav')(({ theme }) => `
  display: flex;
  padding: 4px 0;
  place-items: center;
  place-content: center;
  background-color: ${colors.monacoBackground};
  border-bottom: 2px solid rgba(0,0,0, 0.20);

  div:not(:first-of-type) {
    height: 33px;
    justify-content: left;
    padding: 0 8px;

    button {
      margin-bottom: 4px;
      margin-right: 4px;
    }
  }
`)

export const BrowserInput = styled('input')(({ theme }) => `
  border: none;
  background-color: ${colors.monacoBorder};
  border-radius: 18px;
  color: rgb(255, 255, 255);
  font-family: inherit;
  font-size: 13px;
  height: 28px;
  letter-spacing: 0.2px;
  line-height: 26px;
  margin: 0 6px;
  padding: 0 13px;
  width: 100%;
  
  &:focus {
    outline: 2px solid rgb(138, 180, 248);
  }
`)


export const BrowserView = styled('div')`
  min-width: 100%;
`
import { styled } from '@mui/material/styles'

export const BrowserNav = styled('nav')(({ theme }) => `
  display: flex;
  padding: 4px 0;
  place-items: center;
  place-content: center;
  background-color: #282c34;
  
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


export const BrowserFrame = styled('iframe')(({ theme }) => `
  border: 0;
  height: 100%;
  width: 100%;
  flex-grow: 1;
`)

export const BrowserInput = styled('input')(({ theme }) => `
  border: none;
  background-color: #323842;
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

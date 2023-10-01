import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { styled } from '@mui/material/styles'
import {
  dims,
  colors,
  getColor,
} from '@gobletqa/components'


const getActionsWidth = (tabAmt:number) => {
  const width = (dims.defs.header.height + 8) * 3
  return Math.round((width / tabAmt + Number.EPSILON) * 100) / 100
}

const getTabWidth = (tabAmt:number) => {
  const percent = Math.round((100 / tabAmt + Number.EPSILON) * 100) / 100
  return `calc( ${percent}% - ${getActionsWidth(tabAmt)}px )`
}

const tabHeight = `
  max-height: ${dims.defs.header.hpx};
  min-height: ${dims.defs.header.hpx};
`

export const BottomHeaderTabs = styled(Tabs)(({ theme }) => `
  ${tabHeight}

  & button {
    opacity: 1;
    text-transform: none;
    ${tabHeight}
  }

  & .MuiTabs-indicator {
    display: none;
  }

`)

type TTabHeaderProps = {
  tabAmount:number
  [key:string]:any
}

const noProps = [
  `tabAmount`
]


export const BottomDrawerHeaderTab = styled(Tab, {
  shouldForwardProp: (prop) => !noProps.includes(prop as any),
})(
  ({ theme, tabAmount }:TTabHeaderProps) => {
    const tabWidth = getTabWidth(tabAmount)
    
    return `
      ${tabHeight}
      flex-direction: row;
      letter-spacing: 0.2px;
      max-width: ${tabWidth};
      min-width: ${tabWidth};
      font-weight: ${theme.typography.fontWeightBold};
      transition: background-color 500ms ease-in-out, color 500ms ease-in-out;

      color: ${getColor(colors.gray05, colors.black06, theme)};
      background-color: ${getColor(colors.gray01, colors.black11, theme)};
      border-bottom: 1px solid ${getColor(colors.gray02, colors.black13, theme)};
      border-left: 1px solid ${getColor(colors.gray02, colors.black13, theme)};


      &.Mui-selected {
        color: ${getColor(colors.royalPurple, colors.purple02, theme)};
        background-color: ${getColor(colors.white, colors.purple17, theme)};
      }

      &:hover:not(.Mui-selected) {
        color: ${getColor(colors.royalPurple, colors.purple02, theme)};
        background-color: ${getColor(colors.white, colors.purple17, theme)};
      }
    `
  }
  
)

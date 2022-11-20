import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import { gutter, colors } from '@theme'
import { styled } from '@mui/material/styles'
import Container from '@mui/material/Container'
import { CloseIcon } from '@components/Icons'

export const TabsHeaderList = styled(Tabs)(`
  max-height: 28px;
  min-height: 28px;

  & .MuiTabs-indicator {
    display: none;
  }
`)

export const HeaderTab = styled(Tab)(({ theme }) => (`
  display: flex;
  max-height: 28px;
  min-height: 28px;
  margin-right: 2px;
  padding: 0px 10px;
  text-transform: none;
  letter-spacing: 0.8px;
  color: ${colors.fade50};
  flex-direction: row-reverse;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  background-color: ${colors.black00};
  font-size: ${theme.typography.pxToRem(12)};
  font-weight: ${theme.typography.fontWeightRegular};

  &.Mui-selected {
    color: ${colors.white00};
  }

  &.Mui-focusVisible {
    background-color: rgba(100, 95, 228, 0.32);
  }
`))

export const TabCloseIcon = styled(CloseIcon)`
  top: 3px;
  font-size: 12px;
  margin-left: 10px;
  position: relative;
`

export const TerminalContainer = styled(Container)`
  display: flex;
  min-height: 100%;
  align-items: stretch;
  flex-direction: column;
  background-color: ${colors.backgroundDark};
`

export const TerminalInput = styled(Box)`
  width: 100%;
  overflow: hidden;
  padding-top: ${gutter.padding.tQpx};
  padding-left: ${gutter.padding.tQpx};
  background-color: ${colors.black00};
`
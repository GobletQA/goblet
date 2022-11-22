import { colors } from '@theme'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import { AddIcon } from '@components/Icons'
import { styled } from '@mui/material/styles'
import { CloseIcon } from '@components/Icons'
import Container from '@mui/material/Container'
import { getColor } from '@utils/theme/getColor'

export const TabsHeaderList = styled(Tabs)(`
  max-height: 28px;
  min-height: 28px;
  align-items: end;

  & .MuiTabs-indicator {
    display: none;
  }
`)

export const HeaderTab = styled(Tab)(({ theme }) => (`
  display: flex;
  max-height: 26px;
  min-height: 26px;
  margin-right: 1px;
  min-width: 125px;
  padding: 0px 10px;
  text-transform: none;
  flex-direction: row-reverse;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  color: ${getColor(`colors.fadeDark45`, `colors.fadeLight55`, theme)};
  background-color: ${getColor(`colors.gray04`, `colors.black01`, theme)};
  font-size: ${theme.typography.pxToRem(12)};
  font-weight: ${theme.typography.fontWeightRegular};

  &.Mui-selected {
    font-weight: ${theme.typography.fontWeightBold};
    color: ${getColor(`colors.fadeLight80`, `colors.fadeDark80`, theme)};
    background-color: ${getColor(`colors.black00`, `colors.white00`, theme)};
    
    & .terminal-tab-close-icon {
      color: ${getColor(`colors.fadeLight80`, `colors.fadeDark80`, theme)};
    }
  }

`))



export const TabAddIcon = styled(AddIcon)(({ theme }) => `
  font-size: 12px;
  color: ${getColor(`colors.fadeDark45`, `colors.fadeLight55`, theme)};
`)

export const TabCloseIcon = styled(CloseIcon)(({ theme }) => `
  top: 3px;
  font-size: 12px;
  margin-left: 10px;
  position: relative;
  color: ${getColor(`colors.fadeDark45`, `colors.fadeLight55`, theme)};
`)

export const TerminalContainer = styled(Container)(({ theme }) => `
  display: flex;
  min-height: 100%;
  align-items: stretch;
  flex-direction: column;
  background-color: ${getColor(`colors.gray01`, `colors.black05`, theme)};
  border-top: 1px solid ${getColor(`colors.gray02`, `colors.black01`, theme)};
`)

export const TerminalInput = styled(Box)`
  width: 100%;
  flex-Grow: 1;
  overflow: hidden;
  background-color: ${colors.black00};
`
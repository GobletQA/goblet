import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import { colors, dims } from '@theme'
import { AddIcon } from '@components/Icons'
import { styled } from '@mui/material/styles'
import { CloseIcon } from '@components/Icons'
import Container from '@mui/material/Container'
import { getColor } from '@utils/theme/getColor'
import { IconButton } from '@components/Buttons/IconButton'

export const TerminalContainer = styled(Container)(({ theme }) => `
  display: flex;
  min-height: 100%;
  position: relative;
  align-items: stretch;
  flex-direction: column;
  background-color: ${getColor(`colors.gray01`, `colors.black05`, theme)};
  border-top: 1px solid ${getColor(`colors.gray02`, `colors.black02`, theme)};
`)

export const TabsHeaderList = styled(Tabs)(`
  max-height: ${dims.terminal.header.hpx};
  min-height: ${dims.terminal.header.hpx};
  align-items: end;

  & .MuiTabs-indicator {
    display: none;
  }
`)

export const HeaderTab = styled(Tab)(({ theme }) => {
  const shared = `
    color: ${getColor(`colors.fadeLight90`, `colors.fadeLight90`, theme)};
    background-color: ${getColor(`colors.black00`, `colors.black00`, theme)};
    
    & .terminal-tab-add-icon,
    & .terminal-tab-close-icon {
      color: ${getColor(`colors.fadeLight90`, `colors.fadeLight90`, theme)};
    }

    & .terminal-tab-close-icon {
      color: ${colors.cardinal};
    }
  `

  return `
    display: flex;
    margin-right: 1px;
    padding: 0px 10px;
    text-transform: none;
    flex-direction: row-reverse;
    // border-top-left-radius: 8px;
    // border-top-right-radius: 8px;
    justify-content: space-between;
    max-height: ${dims.terminal.tab.hpx};
    min-height: ${dims.terminal.tab.hpx};
    min-width: ${dims.terminal.tab.maxWpx};
    font-size: ${theme.typography.pxToRem(12)};
    font-weight: ${theme.typography.fontWeightRegular};
    transition: background-color 200ms ease, color 200ms ease;
    color: ${getColor(`colors.fadeDark45`, `colors.fadeLight55`, theme)};
    background-color: ${getColor(`colors.gray04`, `colors.fadeDark55`, theme)};

    &.Mui-selected {
      font-weight: ${theme.typography.fontWeightBold};
      ${shared}
    }

    &:hover {
      ${shared}

      .terminal-tab-add-icon {
        color: ${colors.shamrock};
      }
    }
`
})

export const TabAddIcon = styled(AddIcon)(({ theme }) => `
  width: 15px;
  height: 15px;
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

export const TerminalExpandBtn = styled(IconButton)(({ theme }) => `
  width: 48px;
  display: flex;
  border-radius: 0px;
  place-items: center;
  font-family: inherit;
  place-content: center;
  background-color: transparent;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
`)

export const TerminalInput = styled(Box)(({ theme }) => `
  width: 100%;
  flex-grow: 1;
  overflow: hidden;
  background-color: ${getColor(`colors.black00`, `colors.black00`, theme)};
`)

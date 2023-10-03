import Box from '@mui/material/Box'
import { Theme, styled } from '@mui/material/styles'
import {
  cmx,
  Input,
  Span,
  Button,
  colors,
  gutter,
  InText,
  getColor,
  JokerIcon,
  PersonIcon,
} from '@gobletqa/components'

const sidebarStyle = (theme:Theme) => `
  ::-webkit-scrollbar-track {
      background: ${getColor(colors.white, colors.purple23, theme)};
      box-shadow: inset 0 0 5px ${getColor(`${colors.gray07}00`, `#${colors.purple19}00`, theme)};
      -webkit-box-shadow: inset 0 0 5px ${getColor(`${colors.gray07}00`, `#${colors.purple19}00`, theme)};
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: ${getColor(colors.gray03, `${colors.purple13}66`, theme)};
    box-shadow: inset 0 0 5px ${getColor(`${colors.gray07}00`, `#${colors.purple19}00`, theme)};
    -webkit-box-shadow: inset 0 0 5px ${getColor(`${colors.gray07}00`, `#${colors.purple19}00`, theme)};
  }

`

export const JokerFeatureContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: start;
  flex-direction: column;
  justify-content: space-between;
`

export const JokerMessagesContainer = styled(Box)(({ theme }) => `
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: ${gutter.padding.px};
  margin: ${gutter.margin.px} 0px;

  ${sidebarStyle(theme)}
`)

export const JokerMessages = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: ${gutter.padding.qpx};
`

export const JokerQContainer = styled(Box)(({ theme }) => `
  width: 100%;
  display: flex;
  padding: ${gutter.padding.px};
  border-top: 1px solid ${getColor(colors.gray01, colors.black13, theme)};
  background-color: ${cmx(getColor(colors.white01, colors.black18, theme), 80)};
`)
export const JokerQInputContainer = styled(Box)`
  flex: 1;
  width: 100%;
`

export const JokerQInput = styled(Input)(({ theme }) => `
  & input {
    background-color: ${getColor(colors.white, colors.black20, theme)};
  }
`)

export const JokerQSubmitContainer = styled(Box)`
  margin-left: ${gutter.margin.hpx};
`
export const JokerQSubmit = styled(Button)``


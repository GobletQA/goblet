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
export const JokerMessageContainer = styled(Box)`
  width: 85%;
  display: flex;
  border-radius: 5px;
  flex-direction: column;
  margin-bottom: ${gutter.margin.px};
  padding: ${gutter.padding.tQpx} ${gutter.padding.px};

  &.gb-joker-message-container-User {
    align-self: end;
    justify-content: start;
    flex-direction: row-reverse;
    background-color: ${getColor(colors.white01, colors.purple20)};
  }
  &.gb-joker-message-container-Joker {
    background-color: ${cmx(getColor(colors.purple06, colors.purple18), 50)};
  }
`
export const JokerMessageContent = styled(Box)`
  width: 100%;
  display: flex;
  white-space: normal;
  
  &.gb-joker-message-User {
    align-self: end;
    justify-content: start;
    flex-direction: row-reverse;
  }
  &.gb-joker-message-Joker {
    
  }
`

export const JokerMessageIconContainer = styled(Box)``

export const JokerMessageIconJoker = styled(JokerIcon)`
  padding: 4px;
  border-radius: 5px;
  margin-right: ${gutter.margin.px};
  margin-top: -${gutter.margin.qpx};
  margin-left: -${gutter.margin.hpx};
  margin-bottom: ${gutter.margin.hpx};
  color: ${getColor(colors.purple00, colors.purple20)};
  background-color: ${getColor(colors.gray19, colors.gray03)};
`

export const JokerMessageIconUser = styled(PersonIcon)`
  padding: 4px;
  border-radius: 5px;
  margin-left: ${gutter.margin.px};
  margin-top: -${gutter.margin.qpx};
  margin-right: -${gutter.margin.hpx};
  margin-bottom: ${gutter.margin.hpx};
  color: ${getColor(colors.purple19, colors.gray03)};
  background-color: ${cmx(getColor(colors.gray04, colors.purple20), 80)};
`


export const JokerMessageTextContainer = styled(Box)`
  width: 100%; 
`
export const JokerMessageText = styled(Span)`
  white-space: pre-line;
`

export const JokerMessageActionsContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: end;
  margin-top: ${gutter.margin.px};
`
export const JokerMessageAction = styled(Button)`
  font-size: 12px;
  margin-left: ${gutter.margin.hpx};
  padding: ${gutter.padding.qpx} ${gutter.padding.hpx};
  
  &.MuiButton-contained {
    background-color: ${getColor(colors.gray19, colors.gray03)};
  }
  
  &.MuiButton-text {
    color: ${getColor(colors.gray20, colors.gray02)};
    
    &.gb-joker-message-action-CancelAction {
      font-weight: bold;
      color: ${colors.red10};
    }
    
  }
  
`

export const JokerMessageActionText = styled(InText)``



export const JokerQContainer = styled(Box)`
  width: 100%;
  display: flex;
  padding: ${gutter.padding.px};
  border-top: 1px solid ${getColor(colors.gray01, colors.black13)};
  background-color: ${cmx(getColor(colors.white01, colors.black18), 80)};
`
export const JokerQInputContainer = styled(Box)`
  flex: 1;
  width: 100%;
`
export const JokerQInput = styled(Input)`
  & input {
    background-color: ${getColor(colors.white, colors.black20)};
  }
`

export const JokerQSubmitContainer = styled(Box)`
  margin-left: ${gutter.margin.hpx};
`
export const JokerQSubmit = styled(Button)``


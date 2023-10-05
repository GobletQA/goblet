import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  cmx,
  Span,
  Button,
  colors,
  gutter,
  InText,
  getColor,
  JokerIcon,
  PersonIcon,
} from '@gobletqa/components'

export const JokerMessageContainer = styled(Box)(({ theme }) => `
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
    background-color: ${getColor(colors.gray02, colors.black08, theme)};
  }
  &.gb-joker-message-container-Joker {
    background-color: ${getColor(cmx(colors.shinyShamrock, 30), colors.purple17, theme)};
  }
`)

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

export const JokerMessageIconJoker = styled(JokerIcon)(({ theme }) => `
  padding: 4px;
  border-radius: 5px;
  margin-right: ${gutter.margin.px};
  margin-top: -${gutter.margin.qpx};
  margin-left: -${gutter.margin.hpx};
  margin-bottom: ${gutter.margin.hpx};
  background-color: ${getColor(colors.gray19, colors.black08, theme)};
  color: ${getColor(colors.green00, colors.purple00, theme)};
`)

export const JokerMessageIconUser = styled(PersonIcon)(({ theme }) => `
  padding: 4px;
  border-radius: 5px;
  margin-left: ${gutter.margin.px};
  margin-top: -${gutter.margin.qpx};
  margin-right: -${gutter.margin.hpx};
  margin-bottom: ${gutter.margin.hpx};
  color: ${getColor(colors.green19, colors.gray01, theme)};
  background-color: ${getColor(colors.gray05, colors.black09, theme)};
`)


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
export const JokerMessageActionContainer = styled(Button)(({ theme }) => `
  font-size: 12px;
  margin-left: ${gutter.margin.hpx};
  padding: ${gutter.padding.qpx} ${gutter.padding.hpx};
  
  &.MuiButton-contained {
    background-color: ${getColor(colors.gray19, colors.black08, theme)};
    &:hover {
      background-color: ${getColor(colors.gray21, colors.black06, theme)};
    }
  }
  
  &.MuiButton-text {
    color: ${getColor(colors.gray20, colors.gray02, theme)};
    
    &.gb-joker-message-action-CancelAction {
      font-weight: bold;
      color: ${colors.red10};
    }
    
  }
`)

export const JokerMessageActionText = styled(InText)``

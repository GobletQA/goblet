
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  Span,
  colors,
  gutter,
  SkipIcon,
  FailIcon,
  PassIcon,
} from '@gobletqa/components'

export const DecoContainer = styled(Box)`
  z-index: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
`

const shared = `
  display: flex;
  align-items: center;
  justify-content: center;
`

export const DecoErrorContainer = styled(Box)`
  ${shared}
  color: ${colors.red10};
`

export const DecoFailContainer = styled(Span)`
  ${shared}
  color: ${colors.red10};
`

export const DecoPassContainer = styled(Span)`
  ${shared}
  color: ${colors.shinyShamrock};
`

export const DecoCanceledContainer = styled(Span)`
  ${shared}
  color: ${colors.yellow12};
`

export const DecoSuccessContainer = styled(Span)`
  ${shared}
  color: ${colors.shinyShamrock};
`

export const DecoSpinContainer = styled(Span)`
  ${shared}
`

export const DecoFailIcon = styled(FailIcon)`
  color: ${colors.red10};
`
export const DecoPassIcon = styled(PassIcon)`
  color: ${colors.shinyShamrock};
`

export const DecoCanceledIcon = styled(SkipIcon)`
  color: ${colors.yellow12};
`

export const DecoSpinIcon = styled(Span)`
  font-size: 3px;
  border-radius: 50%;
  width: 20px !important;
  height: 20px !important;
  border-left: 1em solid ${colors.purple10};
  border-top: 1em solid ${colors.purple10}33;
  border-right: 1em solid ${colors.purple10}33;
  border-bottom: 1em solid ${colors.purple10}33;
`

export const DecoLineHighlight = styled(Box)`
  z-index: 0;
  left: 0px;
  right: 0px;
  width: 100%;
  position: absolute;
  // Odd hack needed to cover the entire element
  // Pretty sure it's related to a border somewhere, on the dropdown maybe?
  height: calc(100% + 1px);

  &.top {
    top: 0px;
  }

  &.bottom {
    // See comment above
    bottom: -1px;
  }

  &.failed {
    background-color: ${colors.red10}33;
    border-bottom: 2px solid ${colors.red10}66;
  }

  &.passed {
    background-color: ${colors.green10}33;
    border-bottom: 2px solid ${colors.green10}66;
  }

  &.canceled {
    background-color: ${colors.yellow12}33;
    border-bottom: 2px solid ${colors.yellow12}66;
  }

  &.gb-player-running {
    background-color: ${colors.purple10}33;
    border-bottom: 2px solid ${colors.purple10}66;
  }

`
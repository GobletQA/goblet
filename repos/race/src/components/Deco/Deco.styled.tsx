
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  Span,
  colors,
  gutter,
  FailIcon,
  PassIcon,
} from '@gobletqa/components'

export const DecoContainer = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const shared = `
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${gutter.margin.hpx};
`

export const DecoErrorContainer = styled(Box)`
  ${shared}
  color: ${colors.red10};
`

export const DecoFailContainer = styled(Span)`
  ${shared}
`

export const DecoPassContainer = styled(Span)`
  ${shared}
  color: ${colors.shinyShamrock};
`

export const DecoSuccessContainer = styled(Span)`
  ${shared}
`

export const DecoSpinContainer = styled(Span)`
  ${shared}
`

export const DecoFailIcon = styled(FailIcon)``
export const DecoPassIcon = styled(PassIcon)``
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

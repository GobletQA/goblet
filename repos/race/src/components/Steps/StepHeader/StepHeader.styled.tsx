import { styled } from '@mui/material/styles'
import { Span, gutter, colors } from '@gobletqa/components'

const header = {
  shared: `
    opacity: 0.8;
    font-size: 13.5px;
    font-weight: bold;
    transition: color 300ms ease, opacity 300ms ease;
  `
}

export const StepHeaderText = styled(Span)`
  font-size: 13.5px;
  padding: ${gutter.padding.qpx};
  padding-left: ${gutter.padding.hpx};
`

export const StepHeaderType = styled(Span)`
  ${header.shared}
  margin-right: 5px;
  color: var(--goblet-list-highlightForeground);
`

export const StepHeaderPart = styled(Span)`
  ${header.shared}
  color: var(--goblet-editor-foreground);
`

export const StepHeaderExp = styled(Span)`
  ${header.shared}
  color: ${colors.green12};
`

export const StepHeaderPlaceholder = styled(Span)`
  ${header.shared}
  margin-left: 3px;
  margin-right: 3px;
  color: ${colors.lightEditor.chartOrange};
`

export const StepHeaderMissing = styled(Span)`
  ${header.shared}
  color: ${colors.red08};
`

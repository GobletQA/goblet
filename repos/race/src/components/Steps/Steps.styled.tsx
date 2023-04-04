import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import CardContent from '@mui/material/CardContent'
import { Span, gutter, colors } from '@gobletqa/components'

const header = {
  shared: `
    opacity: 0.5;
    font-size: 13.5px;
    font-weight: bold;
    transition: color 300ms ease, opacity 300ms ease;
  `
}

export const StepContainer = styled(Card)`
  width: 100%;
  border: none;
  background-color: var(--goblet-editorGroup-background);

  & .gb-dropdown-header {
    transition: border 300ms ease;
    border-bottom: 1px solid transparent;
  }

  & .gb-dropdown-header.Mui-expanded {
    border-bottom: 1px solid var(--goblet-editorGroupHeader-tabsBorder);
  }
  
  & .gb-step-section {
    margin-bottom: 2px;
  }

  
`
export const StepContent = styled(CardContent)`
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: center;
  padding: 0px;
  padding-top: ${gutter.padding.px};

  &:last-child {
    padding-bottom: 0px;
  }
`

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
  margin-left: 3px;
  margin-right: 3px;
  color: ${colors.green10};
`

export const StepHeaderPlaceholder = styled(Span)`
  ${header.shared}
  margin-left: 3px;
  margin-right: 3px;
  color: ${colors.red10};
`

export const StepGrid = styled(Grid)``
export const StepGridItem = styled(Grid)``

export const ActionInfoText = styled(Span)`
  width: 100%;
  font-size: 12px;
  padding-top: 2px;
  white-space: nowrap;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden !important;
`

export const EmptyItem = styled(Box)`
  display: flex;
  align-items: start;
  justify-content: start;
  flex-direction: column;
  padding-left: 0px;
  padding-right: 0px;
  margin-bottom: 0px !important;
`


import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { colors, gutter } from '@gobletqa/components'
import { Dropdown as DropdownComp } from '@gobletqa/components'

export const Container = styled(Paper)`
  color: var(--goblet-editor-foreground);
  background-color: var(--goblet-editor-background);
  // border-bottom: 1px solid ${colors.gray00};
`

export const InputContainer = styled(Box)`
  min-height: 40px;
`


export const Dropdown = styled(DropdownComp)`
  
  // border-bottom: 1px solid ${colors.gray00};
  
  &.Mui-expanded:last-of-type {
    margin-bottom: 20px;
  }

  &.Mui-expanded .MuiAccordionSummary-root {
    background-color: var(--goblet-list-focusBackground);
  }

  & .MuiAccordionSummary-root {
    height: 40px;
    min-height: 40px;
    transition: background-color 300ms ease;
    background-color: var(--goblet-editor-background);
    padding: ${gutter.padding.hpx} ${gutter.padding.hpx};

    &:hover {
      background-color: var(--goblet-list-focusBackground);
    }

  }
  
  & .MuiAccordionSummary-content {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  
  & .MuiAccordionDetails-root {
    padding-bottom: ${gutter.padding.hpx};
  }

  & .MuiCollapse-root {
    padding-left: ${gutter.padding.hpx};
    padding-right: ${gutter.padding.hpx};
  }

`

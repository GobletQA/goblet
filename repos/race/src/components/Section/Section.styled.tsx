import type { TGobletTheme } from '@gobletqa/components'
import type { ComponentProps, ComponentType } from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import MuiStack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import {
  Span,
  gutter,
  Button,
  IconButton,
  Dropdown as DropdownComp
} from '@gobletqa/components'

type TGutterComp = ComponentProps<typeof Box> & {
  gutter?:boolean
  theme?:TGobletTheme
}

const gutterComp = (Component:ComponentType<any>, styles:string=``) => {
  return styled(Component, {
    shouldForwardProp: (prop:string) => prop !== 'gutter'
  })(({ theme, gutter }:TGutterComp) => {
      return `
        width: 100%;
        ${styles}
        ${
          gutter
            ? [
                `padding-left: ${theme?.gutter?.padding?.px};`,
                `padding-right: ${theme?.gutter?.padding?.px};`
              ].join(`\n`)
            : ``
        }
      `
  })

}

export const Container = styled(Paper)`
  margin-top: 10px;
  color: var(--goblet-editor-foreground);
  background-color: var(--goblet-editor-background);
`

export const InputContainer = styled(Box)`
  min-height: 40px;
`

export const SectionActBtn = styled(Button)`
  margin-left: 5px;
  margin-right: 5px;
`

export const SectionActIcnBtn = styled(IconButton)`
  margin-left: 5px;
  margin-right: 5px;
`

export const SectionActs = styled(Box)`
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 300ms ease;
`

export const Dropdown = styled(DropdownComp)`

  & .gc-dropdown-header {
    flex-direction: row-reverse;
  }

  &.Mui-expanded:last-of-type {
    // margin-bottom: 20px;
  }

  &.Mui-expanded > .MuiAccordionSummary-root {
    background-color: var(--goblet-list-focusBackground);

    & .gr-section-actions {
      opacity: 1;
    }

  }

  & > .MuiAccordionSummary-root {
    height: 40px;
    min-height: 40px;
    transition: background-color 300ms ease;
    background-color: var(--goblet-editor-background);
    padding: ${gutter.padding.hpx} ${gutter.padding.hpx};

    &:hover {
      background-color: var(--goblet-list-focusBackground);
      
      & .gr-section-actions {
        opacity: 1;
      }
    }

  }
  
  & .MuiAccordionSummary-content {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  
  & .MuiAccordionDetails-root {
    // padding-bottom: ${gutter.padding.hpx};
  }

  & .MuiCollapse-root {
    padding-left: ${gutter.padding.hpx};
    // padding-right: ${gutter.padding.hpx};
  }

`

export const StackContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
`)


export const StackContent = gutterComp(MuiStack, `
  width: 100%;
  height: 100%;
  & > .MuiBox-root {
    margin-top: 0px
  }
`)

export const StackBody = gutterComp(Box)


export const SectionHeaderText = styled(Span)`
  font-size: 14px;
  padding: ${gutter.padding.qpx};
  padding-left: ${gutter.padding.hpx};
  color: var(--goblet-editor-foreground);
`
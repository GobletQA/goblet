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
  margin-top: ${gutter.margin.hpx};
  color: var(--goblet-editor-foreground);
  background-color: var(--goblet-editor-background);

  & > .gc-dropdown {
    padding: 20px;

    & > .MuiButtonBase-root.gc-dropdown-header {
      margin-top: -20px;
      margin-left: -20px;
      margin-right: -20px;
      margin-bottom: -20px;
      transition: margin-bottom 300ms ease;
    }
    
    & > .MuiButtonBase-root.gc-dropdown-header.Mui-expanded {
      margin-bottom: 0px;
    }

  }
`

export const InputContainer = styled(Box)`
  min-height: 40px;
`

export const SectionActBtn = styled(Button)`
  margin-left: ${gutter.margin.qpx};
  margin-right: ${gutter.margin.qpx};
`

export const SectionActIcnBtn = styled(IconButton)`
  margin-left: ${gutter.margin.qpx};
  margin-right: ${gutter.margin.qpx};
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

  & .MuiCollapse-root {
    padding-left: ${gutter.padding.hpx};
  }

  & .gr-section-dropdown-step .MuiCollapse-root {
    padding-left: 0px;
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
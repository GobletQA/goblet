import type { TGobletTheme } from '@gobletqa/components'
import type { ComponentProps, ComponentType } from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import MuiStack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import {
  Span,
  dims,
  colors,
  gutter,
  Button,
  IconButton,
  DragIndicatorIcon,
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

const headerActiveColor = colors.purple01

export const Container = styled(Paper)`
  border: none;
  position: relative;
  margin-top: ${gutter.margin.px};
  color: var(--goblet-editor-foreground);
  background-color: var(--goblet-tab-activeBackground);

  & > .gb-dropdown {
    padding: 20px;
    border: 1px solid var(--goblet-editorGroupHeader-tabsBorder);
    overflow: hidden;
    border-radius: 4px;

    & > .MuiButtonBase-root.gb-dropdown-header {
      margin-top: -20px;
      margin-left: -20px;
      margin-right: -20px;
      margin-bottom: -20px;
      transition: background-color 300ms ease, margin-bottom 300ms ease;
    }

    & > .MuiButtonBase-root.gb-dropdown-header.Mui-expanded {
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
  cursor: default;
  transition: background-color 300ms ease;

  & .gb-dropdown-header {
    flex-direction: row-reverse;
  }

  & .gb-dropdown-expand-icon {

    &:hover {
      color: ${colors.green10};
    }
    
    &.expanded {
      color: ${colors.green10};
    }
  }

  &.Mui-expanded > .MuiAccordionSummary-root {
    background-color: ${headerActiveColor};

    & .gb-section-actions {
      opacity: 1;
    }

  }

  & > .MuiAccordionSummary-root {
    height: 40px;
    min-height: 40px;
    transition: background-color 300ms ease;
    padding: ${gutter.padding.hpx} ${gutter.padding.hpx};
    background-color: var(--goblet-tab-activeBackground);

    &:hover {
      background-color: ${headerActiveColor};
      & .gb-section-actions {
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

  & .gb-section-dropdown-step .MuiCollapse-root {
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

export const SectionDragHandleContainer = styled(Box)`
  z-index: 1;
  left: 0px;
  width: 24px;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  height: ${dims.dropdown.header.px};
`

export const SectionDragHandleIcon = styled(DragIndicatorIcon)`
  background-color: transparent;
`
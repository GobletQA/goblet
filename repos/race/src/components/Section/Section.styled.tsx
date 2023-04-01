import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
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

const action = {
  button:`
    margin-left: ${gutter.margin.qpx};
    margin-right: ${gutter.margin.qpx};
  `
}

const dnd = {
  dropdown: `
    &.gb-section-dropdown-dnd {
      & .gb-dropdown-header {
        padding-left: 30px;
      }
    }
  `,
  dragHandle: `
    z-index: 1;
    left: 15px;
    width: 10px;
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    height: ${dims.dropdown.header.px};
  `,
  dragIcon: `
    background-color: transparent;
  `
}

const dropdown = {
  headerActive:`
    background-color: ${colors.purple01};
    & .gb-section-actions {
      opacity: 1;
    }
  `,
}

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

export const SectionHeaderText = styled(Span)`
  font-size: 14px;
  padding: ${gutter.padding.qpx};
  color: var(--goblet-editor-foreground);
`

export const SectionDragHandleContainer = styled(Box)(dnd.dragHandle)
export const SectionDragHandleIcon = styled(DragIndicatorIcon)(dnd.dragIcon)

export const SectionActs = styled(Box)`
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 300ms ease;
`
export const SectionActBtn = styled(Button)(action.button)
export const SectionActIcnBtn = styled(IconButton)(action.button)

export const Dropdown = styled(DropdownComp)`
  cursor: default;
  transition: background-color 300ms ease;
  ${dnd.dropdown}

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
    ${dropdown.headerActive}
  }

  & > .MuiAccordionSummary-root {
    height: 40px;
    min-height: 40px;
    transition: background-color 300ms ease;
    padding: ${gutter.padding.hpx} ${gutter.padding.hpx};
    background-color: var(--goblet-tab-activeBackground);

    &:hover {
      ${dropdown.headerActive}
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
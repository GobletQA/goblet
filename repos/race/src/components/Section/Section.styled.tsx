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
    height: ${dims.race.section.header.px};
  `,
  dragIcon: `
    background-color: transparent;
  `
}

const dropdown = {
  headerActive:`
    & .gb-section-actions {
      opacity: 1;
    }
  `,
}

const header = {
  textShared: `
    font-size: 14.5px;
    font-weight: bold;
    transition: color 300ms ease;
    color: var(--goblet-list-deemphasizedForeground);
  `,
  textActive: `
    & > .gb-section-dropdown > .gb-dropdown-header .section-header-text-type {
      color: var(--goblet-list-highlightForeground);
    }

    & > .gb-section-dropdown > .gb-dropdown-header .section-header-text-content {
      color: var(--goblet-editor-foreground);
    }
  `
}

export const Container = styled(Paper)`
  border: none;
  position: relative;
  margin-top: ${gutter.margin.px};
  color: var(--goblet-editor-foreground);
  background-color: var(--goblet-tab-activeBackground);
  border: 1px solid var(--goblet-editorGroupHeader-tabsBorder);
  transition: border 300ms ease, box-shadow 300ms ease;
  
  &:hover {
    ${header.textActive}
  }

  &:hover:not(.gb-section-dropdown-expanded) { 
    box-shadow: 0px 4px 0px -2px var(--goblet-list-highlightForeground);
  }

  &.gb-section-dropdown-expanded {
    ${header.textActive}
  }

  & > .gb-dropdown {
    // padding: 20px;
    overflow: hidden;
    border-radius: 4px;

    & > .MuiButtonBase-root.gb-dropdown-header {
      // margin-top: -20px;
      // margin-left: -20px;
      // margin-right: -20px;
      // margin-bottom: -20px;
      transition: margin-bottom 300ms ease, border 300ms ease, box-shadow 300ms ease;
    }

    & > .MuiButtonBase-root.gb-dropdown-header.Mui-expanded {
      margin-bottom: 0px;
    }

  }
`

export const SectionHeaderText = styled(Span)`
  font-size: 14.5px;
  padding: ${gutter.padding.qpx};
`

export const SectionHeaderType = styled(Span)`
  ${header.textShared}
`
export const SectionHeaderContent = styled(Span)`
  margin-left: 5px;
  ${header.textShared}
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
    height: ${dims.race.section.header.px};
    min-height: ${dims.race.section.header.px};
    transition: background-color 300ms ease;
    padding: ${gutter.padding.hpx} ${gutter.padding.hpx};
    background-color: var(--goblet-tab-activeBackground);
    // border-bottom: 1px solid transparent;
    transition: border 300ms ease;

    &:hover {
      ${dropdown.headerActive}
    }
    
    &.Mui-expanded {
      // border-bottom: 1px solid var(--goblet-editorGroupHeader-tabsBorder);
    }
    
    
  }

  & .MuiAccordionSummary-content {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  & .MuiCollapse-root {
  }
  
  & .gb-dropdown-body {
    padding-left: ${gutter.padding.tQpx};
    padding-right: ${gutter.padding.tQpx};
    background-color: var(--goblet-editor-background);
    // background-color: ${colors.white01};

    border: 5px solid #fff;
    border-top: none;
    box-shadow: inset 0px 0px 2px 0px rgba(0,0,0,0.1);
  }

  & .gb-section-dropdown-step .MuiCollapse-root {
    padding-left: 0px;
  }

`
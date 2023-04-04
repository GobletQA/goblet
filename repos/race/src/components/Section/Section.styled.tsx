import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { headerCss } from './SectionHeader.styled'
import {
  dims,
  colors,
  gutter,
  DragIndicatorIcon,
  Dropdown as DropdownComp
} from '@gobletqa/components'

const dndCss = {
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

const dropdownCss = {
  headerActive:`
    & .gb-section-actions {
      opacity: 1;
    }
  `,
}

export const SectionContainer = styled(Paper)`
  border: none;
  position: relative;
  margin-top: ${gutter.margin.px};
  color: var(--goblet-editor-foreground);
  background-color: var(--goblet-tab-activeBackground);
  border: 1px solid var(--goblet-editorGroupHeader-tabsBorder);
  transition: border 300ms ease, box-shadow 300ms ease;

  &:hover {
    ${headerCss.textActive}
  }


  &.gb-section-dropdown-expanded {
    ${headerCss.textActive}
  }

  & > .gb-dropdown {
    overflow: hidden;
    border-radius: 4px;

    & > .MuiButtonBase-root.gb-dropdown-header {
      transition: margin-bottom 300ms ease, border 300ms ease, box-shadow 300ms ease;
    }

    & > .MuiButtonBase-root.gb-dropdown-header.Mui-expanded {
      margin-bottom: 0px;
    }

  }
`
export const SectionDropdown = styled(DropdownComp)`
  cursor: default;
  transition: background-color 300ms ease;
  ${dndCss.dropdown}

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
    ${dropdownCss.headerActive}
  }

  & > .MuiAccordionSummary-root {
    height: ${dims.race.section.header.px};
    min-height: ${dims.race.section.header.px};
    transition: background-color 300ms ease;
    padding: ${gutter.padding.hpx} ${gutter.padding.hpx};
    background-color: var(--goblet-tab-activeBackground);
    transition: border 300ms ease;

    &:hover {
      ${dropdownCss.headerActive}
    }
  }

  & .MuiAccordionSummary-content {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  & .gb-section-dropdown-step .MuiCollapse-root {
    padding-left: 0px;
  }
`

export const SectionContent = styled(Box)`
  padding-top: ${gutter.padding.px};
  padding-bottom: ${gutter.padding.px};
  padding-left: ${gutter.padding.tQpx};
  padding-right: ${gutter.padding.tQpx};
  box-shadow: inset 0px 0px 2px 0px ${colors.fadeDark10};
  border-left: 5px solid var(--goblet-editor-background);
  border-right: 5px solid var(--goblet-editor-background);
  background-color: var(--goblet-editorGroup-background);
`

export const SectionFooter = styled(Box)`
  padding: ${gutter.padding.hpx} ${gutter.padding.qpx} ${gutter.padding.hpx};
`

export const SectionDragHandleContainer = styled(Box)(dndCss.dragHandle)
export const SectionDragHandleIcon = styled(DragIndicatorIcon)(dndCss.dragIcon)

export const SectionActs = styled(Box)`
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 300ms ease;
`
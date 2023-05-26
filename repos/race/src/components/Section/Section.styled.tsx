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
        padding: 0px;
        padding-left: 30px;
      }
    }
  `,
  dragHandle: `
    z-index: 1;
    left: 10px;
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
  transition: border ${dims.trans.avgEase}, box-shadow ${dims.trans.avgEase};

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
      transition: margin-bottom ${dims.trans.avgEase}, border ${dims.trans.avgEase}, box-shadow ${dims.trans.avgEase};
    }

    & > .MuiButtonBase-root.gb-dropdown-header.Mui-expanded {
      margin-bottom: 0px;
    }

  }
`
export const SectionDropdown = styled(DropdownComp)`
  cursor: default;
  transition: background-color ${dims.trans.avgEase};
  background-color: var(--goblet-tab-activeBackground);
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
    // height: ${dims.race.section.header.px};
    height: auto;
    transition: border ${dims.trans.avgEase};
    min-height: ${dims.race.section.header.px};
    transition: background-color ${dims.trans.avgEase};
    padding: ${gutter.padding.hpx} ${gutter.padding.hpx};
    background-color: var(--goblet-tab-activeBackground);

    &:hover {
      ${dropdownCss.headerActive}
    }
  }

  & .gb-section-dropdown-step .MuiCollapse-root {
    padding-left: 0px;
  }
`

export const SectionContent = styled(Box)`
  padding-left: ${gutter.padding.hpx};
  padding-right: ${gutter.padding.hpx};
  background-color: var(--goblet-editorGroup-background);
  border-top: 1px solid var(--goblet-editorGroupHeader-tabsBorder);
`

export const SectionFooter = styled(Box)`
  background-color: var(--goblet-editorGroup-background);
  padding: ${gutter.padding.hpx} ${gutter.padding.qpx} ${gutter.padding.hpx};
`

export const SectionDragHandleContainer = styled(Box)(dndCss.dragHandle)
export const SectionDragHandleIcon = styled(DragIndicatorIcon)(dndCss.dragIcon)

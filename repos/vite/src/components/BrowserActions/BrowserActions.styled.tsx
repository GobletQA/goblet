import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  colors,
  gutter,
  InText,
  getColor,
} from '@gobletqa/components'

export const BrowserStateIcon = styled(Box)``



export const TestSuiteText = styled(InText)``
export const TestSuiteTextContainer = styled(Box)``

const closedViewStyles = () => `
  margin-left: ${gutter.margin.hpx};
  padding-left: ${gutter.padding.hpx};
  border-left: 1px solid ${getColor(colors.white01, colors.black09)};


  & .action-text-hover {
    opacity: 0;
  }

  & .action-normal {
    opacity: 1;
    color: ${colors.info};
    transition: opacity 200ms ease-in-out;
  }

  & .action-hover {
    opacity: 0;
    transition: opacity 200ms ease-in-out;
  }
  &:hover {
    & .action-text-hover {
      opacity: 1;
    }
    & .action-text-normal {
      opacity: 0;
    }
    & .action-normal {
      opacity: 0;
    }
    & .action-hover {
      opacity: 1;
    }
  }
`

const openedViewStyles = () => `
  & .action-text-hover {
    opacity: 1;
  }
  & .action-text-normal {
    opacity: 0;
  }
  & .action-normal {
    opacity: 0;
  }
  & .action-hover {
    opacity: 1;
  }
`

export const TestSuiteActionStyles = (testRunsView?:boolean) => `
  & > button {
    width: 140px;
    height: 35px;
    position: relative;
  }
  
  & .action-text {
    top: 5px;
    left: 13px;
    width: 100%;
    position: absolute;
  }

  & .gb-test-runs-cancel-icon {
    left: 10px;
    position: absolute;
  }

  ${!testRunsView ? closedViewStyles() : openedViewStyles()}
`
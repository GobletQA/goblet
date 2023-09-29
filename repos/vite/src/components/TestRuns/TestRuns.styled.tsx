import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  H3,
  dims,
  gutter,
  Button,
  colors,
  getColor,
  TuneIcon,
  CloseIcon,
  IconButton,
  ContentPasteIcon,
  FormatListBulletedIcon
} from '@gobletqa/components'


export const TestRunsContainer = styled(Box)(({ theme }) => `
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  width: 100%;
  z-index: 10;
  height: 100%;
  display: flex;
  position: absolute;
  flex-direction: column;
  background-color: ${getColor(colors.white, colors.purple23, theme)};
  border-right: 1px solid ${getColor(colors.gray01, colors.black10, theme)};
`)

export const TestRunsHeaderContainer = styled(Box)(({ theme }) => `
  display: flex;
  padding-right: 0px;
  align-items: center;
  justify-content: space-between;
  height: ${dims.browser.actions.height}px;
  padding: ${gutter.padding.hpx} ${gutter.padding.px};
  background-color: ${getColor(colors.white, colors.black13, theme)};
`)

export const TestRunsHeaderText = styled(H3)(({ theme }) => `
  color: ${getColor(colors.gray18, colors.purple01, theme)};
`)


export const TestRunsSectionsContainer = styled(Box)(({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: start;
  height: ${dims.header.hpx};
  margin-left: ${gutter.margin.px};
  margin-right: ${gutter.margin.px};
  border-bottom: 1px solid ${getColor(colors.white01, colors.gray15, theme)};
`)


export const TestRunsSection = styled(Box)`
  margin-right: ${gutter.margin.hpx};
`

export const TestRunsSectionBtn = styled(Button)(({ theme }) => `
  border-radius: 0px;
  height: ${dims.header.hpx};
  padding-left: ${gutter.padding.px};
  padding-right: ${gutter.padding.px};
  border-bottom: 1px solid transparent;
  color: ${getColor(colors.gray05, colors.black06, theme)};
  transition: border-bottom ${dims.trans.avgEase}, color ${dims.trans.avgEase};

  &.active {
    border-bottom: 1px solid ${colors.purple10};
    color: ${getColor(colors.royalPurple, colors.purple02, theme)};
  }
`)

export const TestRunsCancelButton = styled(IconButton)``
export const TestRunsCancelButtonIcon = styled(CloseIcon)`
  font-size: 20px;
`

export const TestRunsListIcon = styled(FormatListBulletedIcon)`
  height: 15px;
  width: 15px;
`

export const TestRunsReporterIcon = styled(ContentPasteIcon)`
  height: 15px;
  width: 15px;
`

export const TestRunsOptsIcon = styled(TuneIcon)`
  height: 15px;
  width: 15px;
`


export const TestRunSectionScroll = styled(Box)(({ theme }) => `
  height: 100%;
  display: flex;
  overflow-y: auto;
  flex-direction: column;

  padding: 0px;
  overflow-x: hidden;
  scrollbar-width: none;
  scrollbar-gutter: stable both-edges;
  margin-top: ${gutter.margin.dpx};
  padding-bottom: ${gutter.padding.size * 15}px;

  ::-webkit-scrollbar-track {
      background: ${getColor(colors.white, colors.purple23, theme)};
      box-shadow: inset 0 0 5px ${getColor(`${colors.gray07}00`, `#${colors.purple19}00`, theme)};
      -webkit-box-shadow: inset 0 0 5px ${getColor(`${colors.gray07}00`, `#${colors.purple19}00`, theme)};
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: ${getColor(colors.gray03, `${colors.purple13}66`, theme)};
    box-shadow: inset 0 0 5px ${getColor(`${colors.gray07}00`, `#${colors.purple19}00`, theme)};
    -webkit-box-shadow: inset 0 0 5px ${getColor(`${colors.gray07}00`, `#${colors.purple19}00`, theme)};
  }
`)
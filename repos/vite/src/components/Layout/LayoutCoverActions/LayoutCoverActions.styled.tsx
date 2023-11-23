import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

import {
  dims,
  gutter,
  colors,
  Button,
  LockIcon,
  getColor,
  IconButton,
  LockOpenIcon,
} from '@gobletqa/components'


export const LayoutCoverActionsContainer = styled(Box)(({ theme }) => {
  return `
    width: calc( 100% - ${dims.nav.closedWidth}px );
    bottom: 0px;
    display: flex;
    z-index: 200;
    position: fixed;
    max-width: 100vw;
    overflow: hidden;
    align-items: center;
    justify-content: flex-end;
    padding: ${gutter.padding.qpx} ${gutter.padding.hpx};
    background-color: ${getColor(colors.white00, colors.gray18, theme)};
    border-top: 1px solid ${getColor(colors.gray00, colors.black14, theme)};
    height: ${dims.layout.actions.height}px;
    max-height: ${dims.layout.actions.height}px;
  `
})

export const RunTestsActionContainer = styled(Box)`
  margin-left: ${gutter.margin.px};
`

export const ReportDownloadActionContainer = styled(Box)``

export const ReportDownload = styled(Button)``


export const ToggleScrollLockContainer = styled(Box)`
  margin-right: auto;
`
export const ToggleScrollLockButton = styled(Button)`
  font-size: 10px;
  line-height: 12px;
  border-radius: 5px;
  flex-direction: column;
  padding-bottom: 2px;
  &.locked {
    color: ${colors.cardinal};
  }
  &.unlocked {
    color: ${colors.shinyShamrock};
  }
  
  & svg {
    height: 18px;
    width: 18px;
  }
  
`
export const ToggleScrollLockIcon = styled(LockIcon)`
  font-size: 20px;
  color: ${colors.cardinal};
`
export const ToggleScrollLockIconOpen = styled(LockOpenIcon)`
  font-size: 20px;
  color: ${colors.shinyShamrock};
`
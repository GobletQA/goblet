import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

import {
  dims,
  gutter,
  colors,
  Button,
  LockIcon,
  IconButton,
  LockOpenIcon,
} from '@gobletqa/components'


export const LayoutCoverActionsContainer = styled(Box)`
  width: 100%;
  bottom: 0px;
  display: flex;
  z-index: 200;
  position: fixed;
  max-width: 100vw;
  overflow: hidden;
`


export const TestRunsActionContainer = styled(Box)`

`

export const ReportDownloadContainer = styled(Box)`
`

export const ReportDownload = styled(Button)``


export const ToggleScrollLockContainer = styled(Box)`
  bottom: 20px;
  left: 10px;
  z-index: 200;
  position: relative;
`
export const ToggleScrollLockButton = styled(IconButton)`
  &.locked {
    color: ${colors.cardinal};
  }
  &.unlocked {
    color: ${colors.shinyShamrock};
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
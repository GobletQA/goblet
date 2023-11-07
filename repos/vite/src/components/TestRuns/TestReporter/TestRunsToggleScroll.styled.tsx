import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  colors,
  LockIcon,
  IconButton,
  LockOpenIcon,
} from '@gobletqa/components'

export const TestRunScrollLockContainer = styled(Box)`
  bottom: 35px;
  z-index: 200;
  position: relative;
`
export const TestRunScrollLockButton = styled(IconButton)`
  &.locked {
    color: ${colors.cardinal};
  }
  &.unlocked {
    color: ${colors.shinyShamrock};
  }
`
export const TestRunScrollLockIcon = styled(LockIcon)`
  font-size: 20px;
  color: ${colors.cardinal};
`
export const TestRunScrollLockIconOpen = styled(LockOpenIcon)`
  font-size: 20px;
  color: ${colors.shinyShamrock};
`
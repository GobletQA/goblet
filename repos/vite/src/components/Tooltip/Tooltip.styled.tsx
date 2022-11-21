import type { TooltipProps } from '@mui/material/Tooltip'

import { colors } from '@theme'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'


export const MuiTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: colors.black06,
    boxShadow: theme.shadows[3],
    fontSize: 14,
  },
}))
import type { TooltipProps } from '@mui/material/Tooltip'

import { colors } from '@theme'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'


export type TTooltipProps = TooltipProps & {
  fontSize?: string
}



export const MuiTooltip = styled(({ className, fontSize, ...props }: TTooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme, fontSize=14 }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize,
    boxShadow: theme.shadows[3],
    backgroundColor: colors.black09,
  },
}))
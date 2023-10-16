import type { CSSProperties } from 'react'
import type { TooltipProps } from '@mui/material/Tooltip'

import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
type CSS = CSSProperties

export type TTooltipProps = TooltipProps & {
  fontSize?: string
}

export const MuiTooltip = styled(({ className, fontSize, ...props }: TTooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />)
)(({ theme, fontSize=14, sx }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    ...sx,
    fontSize: fontSize ?? (sx as CSS)?.fontSize,
    boxShadow: (sx as CSS)?.boxShadow ?? theme.shadows[3],
    color: (sx as CSS)?.color ?? `var(--goblet-editor-foreground)`,
    backgroundColor: (sx as CSS)?.backgroundColor ?? `var(--goblet-editor-background)`,
  },
}))

export const TooltipTitle = styled(Box)`
  white-space: pre-line;
`

export const TooltipWrap = styled(`span`)``
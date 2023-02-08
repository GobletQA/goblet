import type { CSSProperties, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { gutter } from '@GBC/theme/gutter'

export type TMenuContext = {
  sx?:CSSProperties
  children: ReactNode
}

export const MenuContext = ({
  sx,
  children
}:TMenuContext) => {
  return (
    <Box
      padding={gutter.padding.hpx}
      sx={sx}
    >
      {children}
    </Box>
  )
}
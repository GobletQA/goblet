import type { ReactNode, CSSProperties } from 'react'
import Paper from '@mui/material/Paper'


export type TSectionProps = {
  elevation?: number
  className?: string
  sx?: CSSProperties
  children: ReactNode
  variant?: "elevation" | "outlined" | undefined
}

export const Section = (props:TSectionProps) => {
  const {
    sx,
    variant,
    className,
    children,
    elevation=0,
  } = props

  return (
    <Paper
      sx={sx}
      variant={variant}
      elevation={elevation}
      className={className}
    >
      {children}
    </Paper>
  )

}


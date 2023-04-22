import type { Theme } from '@mui/material/styles'
import type { CSSProperties } from 'react'

import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import { getColor } from '@GBC/utils/theme/getColor'
import Typography, { TypographyProps } from '@mui/material/Typography'

export type TFade = BoxProps & {
  theme?:Theme
  speed?:number
  sx?: CSSProperties
}

export const Fade = styled(Box)<TFade>(
  ({theme, speed }) => ({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1300,
    height: `100vh`,
    position: `fixed`,
    transitionProperty: `opacity`,
    transitionDuration: `${(speed || 2000) * 0.001}s`,
    backgroundColor: getColor(theme.palette.colors.white, theme.palette.colors.black03, theme),
  })
)

export const FadeSection = styled(Box)<BoxProps>({
  flex: 1,
  height: `100%`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
})

export const FadeView = styled(Box)<BoxProps>({
  flex: 1,
  top: -100,
  textAlign: `center`,
  alignItems: `center`,
  position: `relative`,
  flexDirection: `column`,
  justifyContent: `center`,
})

export const FadeText = styled(
  ((props:TypographyProps) => <Typography variant='h6' {...props} />))<TypographyProps>
  (({ theme, color }:Record<string, any>) => ({
    marginTop: 30,
    textAlign: `center`,
    color: color || getColor(theme.palette.colors.black03, theme.palette.colors.white, theme),
  })
)


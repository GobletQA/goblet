import { styled } from '@mui/system'
import { dims, colors } from '@theme'
import Box, { BoxProps } from '@mui/material/Box'
import Typography, { TypographyProps } from '@mui/material/Typography'

export const Fade = styled(Box)<BoxProps>(
  ({theme, speed }:Record<string, any>) => ({
    left: 0,
    right: 0,
    top: dims.header.height,
    bottom: dims.footer.height * -1,
    zIndex: 10000,
    height: '100vh',
    position: 'fixed',
    backgroundColor: colors.white,
    transitionProperty: 'opacity',
    transitionDuration: `${(speed || 2000) * 0.001}s`,
  })
)

export const FadeSection = styled(Box)<BoxProps>({
  flex: 1,
  height: '100%',
  display: 'flex',
  justifyContents: 'center',
  alignItems: 'center',
})

export const FadeView = styled(Box)<BoxProps>({
  flex: 1,
  top: -100,
  textAlign: `center`,
  alignItems: 'center',
  position: 'relative',
  flexDirection: 'column',
  justifyContents: 'center',
})

export const FadeText = styled(
  ((props:TypographyProps) => <Typography variant='h6' {...props} />))<TypographyProps>
  (({ color=`#111111` }:Record<string, any>) => ({
    color,
    marginTop: 30,
    textAlign: `center`,
  })
)


import type { TThemeTypes } from '@theme/theme.types'

import { ReactNode } from 'react'
import { Screen } from './Screen'
import Box from '@mui/material/Box'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import { SideNav } from '@components/SideNav'
import Container from '@mui/material/Container'


type TRootProps = {
  themeSwitch?: (type:TThemeTypes) => void
  children?: ReactNode
}

export const RootContainer = (props:TRootProps) => {
  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <SideNav />
        <Screen {...props} />
        <Footer />
      </Box>
    </Container>
  )
}
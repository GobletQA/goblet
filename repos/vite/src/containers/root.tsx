import { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import { SideNav } from '@components/SideNav'


type TRootProps = {
  children: ReactNode
}

export const RootContainer = (props:TRootProps) => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <Box sx={{ display: 'flex' }}>
          <Header />
          <SideNav />
          {props.children}
          <Footer />
        </Box>
      </Container>
    </>
  )
}
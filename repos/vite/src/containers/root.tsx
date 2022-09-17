import { ReactNode } from 'react'
import Container from '@mui/material/Container'

import CssBaseline from '@mui/material/CssBaseline'
import { Header } from '@components/header'
import { Footer } from '@components/footer'
import { SideNav } from '@components/sideNav'

type TRootProps = {
  children: ReactNode
}

export const RootContainer = (props:TRootProps) => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <Header />
        <SideNav />
        {props.children}
        <Footer />
      </Container>
    </>
  )
}
import Box from '@mui/material/Box'
import { Outlet } from "react-router-dom"
import { ScreenWrap } from './Root.styled'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import { SideNav } from '@components/SideNav'

type THomeProps = {
  [key:string]: any
}

export default function HomeScreen(props:THomeProps) {
  return (
    <>
      <ScreenWrap className="screen-container">
        <Outlet />
      </ScreenWrap>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <SideNav />
        <Footer />
      </Box>
    </>
  )
  
}
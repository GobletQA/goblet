import Box from '@mui/material/Box'
import Editor from './Editor'
import { ScreenWrap } from './Root.styled'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import { SideNav } from '@components/SideNav'
import { Outlet, useLocation } from "react-router-dom"

type THomeProps = {
  [key:string]: any
}

export default function Home(props:THomeProps) {
  const location = useLocation()
  return (
    <>
      <ScreenWrap className="screen-container">
        {
          location.pathname === '/' || location.pathname.startsWith(Editor.path)
            ? (<Editor />)
            : (<Outlet />)
        }
      </ScreenWrap>
      <Box sx={{ display: 'flex' }}>
        <Header settings={settings} />
        <SideNav />
        <Footer />
      </Box>
    </>
  )
}

Home.path = `/`
Home.element = `Home`
Home.children = [
  {
    element: `Profile`,
  },
  {
    element: `Settings`,
  },
  {
    element: `Team`,
  }
]

const settings = [...Home.children.map(child => child.element), `Logout`]
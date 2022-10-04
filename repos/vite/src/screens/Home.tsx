import Editor from './Editor'
import Box from '@mui/material/Box'
import { HeaderNav } from '@constants'
import * as Icons from '@components/Icons'
import { ScreenWrap } from './Root.styled'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import { SideNav } from '@components/SideNav'
import { Outlet, useLocation } from "react-router-dom"
import { signOutAuthUser } from '@actions/admin/provider/signOutAuthUser'


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
// @ts-ignore
Home.children = HeaderNav.map(item => ({ ...item, Icon: Icons[item.Icon] }))

const settings = [
  ...Home.children,
  {
    divider: true,
    label: `Logout`,
    Icon: Icons.LogoutIcon,
    onClick: signOutAuthUser,
  }
]
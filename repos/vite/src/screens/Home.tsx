import Editor from './Editor'
import Box from '@mui/material/Box'
import { HeaderNav } from '@constants'
import * as Icons from '@components/Icons'
import { ScreenWrap } from './Root.styled'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import { SideNav } from '@components/SideNav'
import { settingsModal } from '@actions/modals'
import { Outlet, useLocation } from "react-router-dom"
import { disconnectRepo } from '@actions/repo/api/disconnect'
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

const navActions = {
  Logout: signOutAuthUser,
  [`Unmount Repo`]: () => disconnectRepo(),
  // settingsModal
  
}

Home.path = `/`
Home.element = `Home`
// @ts-ignore
Home.children = HeaderNav.map((item) => {
  const action = navActions[item?.label as keyof typeof navActions]
  return {
    ...item,
    Icon: Icons[item.Icon as keyof typeof Icons],
    ...(action ? { onClick: action } : {})
  }
})

const settings = [
  ...Home.children,
  {
    divider: true,
    label: `Logout`,
    Icon: Icons.LogoutIcon,
    onClick: signOutAuthUser,
  }
]
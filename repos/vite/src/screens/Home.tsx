
import Editor from './Editor'
import Box from '@mui/material/Box'
import { HeaderNav } from '@constants'
import { LogoutIcon } from '@components/Icons'
import { ScreenWrap } from './Root.styled'
import { SocketProvider } from '@contexts'
import { Header } from '@components/Header'
import { asCallback } from '@utils/helpers'
import { SideNav } from '@components/SideNav'
import { settingsModal } from '@actions/modals'
import { Outlet, useLocation } from "react-router-dom"
import { disconnectRepo } from '@actions/repo/api/disconnect'
import { signOutReload } from '@actions/admin/user/signOutReload'

type THomeProps = {
  [key:string]: any
}

export default function Home(props:THomeProps) {
  const location = useLocation()

  return (
    <SocketProvider>
      <ScreenWrap className="screen-container">
        {
          location.pathname === '/' || location.pathname.startsWith(Editor.path)
            ? (<Editor />)
            : (<Outlet />)
        }
      </ScreenWrap>
      <Box sx={{ display: 'flex' }}>
        <SideNav />
        <Header settings={settings} />
      </Box>
    </SocketProvider>
  )
}

const navActions = {
  Logout: signOutReload,
  Settings: asCallback(settingsModal, false),
  UnmountRepo: asCallback(disconnectRepo, false),
}

Home.path = `/`
Home.element = `Home`
// @ts-ignore
Home.children = HeaderNav.map((item) => {
  const navKey = item?.label.replace(/\s/g,``) as keyof typeof navActions
  const action = navActions[navKey]
  return {
    ...item,
    ...(action ? { onClick: action } : {})
  }
})

const settings = [
  ...Home.children,
  {
    divider: true,
    label: `Sign Out`,
    Icon: LogoutIcon,
    onClick: signOutReload,
  }
]
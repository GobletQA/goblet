import { EContainerState } from '@types'

import { useState, useEffect, useMemo } from 'react'
import Editor from './Editor'
import Box from '@mui/material/Box'
import { HeaderNav } from '@constants'
import * as Icons from '@components/Icons'
import { ScreenWrap } from './Root.styled'
import { Header } from '@components/Header'
import { asCallback } from '@utils/helpers'
import { Footer } from '@components/Footer'
import { SideNav } from '@components/SideNav'
import { Fadeout } from '@components/Fadeout'
import { useUser, useContainer } from '@store'
import { settingsModal } from '@actions/modals'
import { Outlet, useLocation } from "react-router-dom"
import { disconnectRepo } from '@actions/repo/api/disconnect'
import { signOutAuthUser } from '@actions/admin/provider/signOutAuthUser'

type THomeProps = {
  [key:string]: any
}

export default function Home(props:THomeProps) {
  const user = useUser()
  const location = useLocation()
  const container = useContainer()
  const [fade, setFade] = useState(false)

  useEffect(() => {
    !fade
      && user?.id
      && container?.meta?.state !== EContainerState.Running
      && setFade(true)
  }, [fade, user?.id, container?.meta?.state])

  const fadeContent = useMemo(() => {
    if(!user?.id) return `User not authorized. Please login`
    
    const cState = container?.meta?.state
    return cState !== EContainerState.Running
      ? `Waiting for Backend service to initialize...`
      : ``
  }, [user?.id, container?.meta?.state])

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
      <Fadeout start={fade} content={fadeContent} />
    </>
  )
}

const navActions = {
  Logout: signOutAuthUser,
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
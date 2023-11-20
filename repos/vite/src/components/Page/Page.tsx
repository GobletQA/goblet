import type { TSettingNavItem } from '@types'

import Editor from '@screens/Editor'
import { SocketProvider } from '@contexts'
import { PageContainer } from './Page.styled'
import { SideNav } from '@components/SideNav'
import { Outlet, useLocation } from "react-router-dom"
import { Header } from '@components/Header'


type TPage = {
  settings?: TSettingNavItem[]
}

const RenderPage = () => {
  const location = useLocation()
  
  return (
    <PageContainer className="screen-container">
      {
        location.pathname === '/' || location.pathname.startsWith(Editor.path)
          ? (<Editor />)
          : (<Outlet />)
      }
    </PageContainer>
  )
}

export const Page = (props:TPage) => {
  return (
    <SocketProvider>
      <RenderPage />
      <SideNav />
      <Header meuItems={props.settings} />
    </SocketProvider>
  )
}

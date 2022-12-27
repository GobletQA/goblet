import type { ReactNode } from 'react'
import type { TSidebarPanel } from '../../types'

import { Panel } from '../Panel'
import { SidebarContainer } from './Sidebar.styled'

export type TSidebar = {
  children:ReactNode
  Panels?:TSidebarPanel[]
  PrePanels?:TSidebarPanel[]
  
}

export const Sidebar = (props:TSidebar) => {

  const {
    Panels,
    PrePanels,
    children,
  } = props

  return (
    <SidebarContainer className='goblet-sidebar' >
      {PrePanels?.length && PrePanels.map(panel => <Panel key={panel.title || panel.id} {...panel} />)}
      {children}
      {Panels?.length && Panels.map(panel => <Panel key={panel.title || panel.id} {...panel} />)}
    </SidebarContainer>
  )

}
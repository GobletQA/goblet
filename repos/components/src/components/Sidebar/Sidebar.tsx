import type { CSSProperties, ReactNode } from 'react'
import type { TSidebarPanel } from '../../types'

import { Panel } from '../Panel'
import { cls } from '@keg-hub/jsutils'
import { SidebarContainer } from './Sidebar.styled'

export type TSidebar = {
  className?:string
  style?:CSSProperties
  children:ReactNode
  Panels?:TSidebarPanel[]
  PrePanels?:TSidebarPanel[]
}

export const Sidebar = (props:TSidebar) => {

  const {
    style,
    Panels,
    className,
    PrePanels,
    children,
  } = props

  return (
    <SidebarContainer style={style} className={cls('goblet-sidebar', className)} >
      {PrePanels?.length && PrePanels.map(panel => <Panel key={panel.title || panel.id} {...panel} />)}
      {children}
      {Panels?.length && Panels.map(panel => <Panel key={panel.title || panel.id} {...panel} />)}
    </SidebarContainer>
  )

}
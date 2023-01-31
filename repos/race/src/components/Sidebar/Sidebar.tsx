
import type { TSidebar, TPortal } from '@gobletqa/components'
import type { ReactNode, MutableRefObject } from 'react'


import { useMemo } from 'react'
import { isStr } from '@keg-hub/jsutils'
import {
  Sidebar as GBSidebar,
  SidebarPortal as GBSidebarPortal
} from '@gobletqa/components'


export type TRaceSidebar = TSidebar & {
  children: ReactNode
  portal?:string|MutableRefObject<HTMLElement>
}

const RenderSidebar = (props:TRaceSidebar) => {
  const {
    style,
    Panels,
    children,
    PrePanels,
  } = props

  return (
    <GBSidebar
      style={style}
      Panels={Panels}
      PrePanels={PrePanels}
      className='goblet-editor-sidebar-main'
    >
      {children}
    </GBSidebar>
  )
}

export const Sidebar = (props:TRaceSidebar) => {

  const {portal, ...rest} = props

  const portalProps = useMemo(() => {
    if(!portal) return
    const portalProps = {} as Partial<TPortal>
    isStr(portal)
      ? portalProps.id = portal
      : portalProps.elementRef = portal

    return portalProps
  }, [portal])

  return portalProps
    ? (
        <GBSidebarPortal {...portalProps}>
          <RenderSidebar {...rest} />
        </GBSidebarPortal>
      )
    : (<RenderSidebar {...rest} />)
  
}
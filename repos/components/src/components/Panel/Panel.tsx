import type { TPanel } from '../../types'
import type { SyntheticEvent, MutableRefObject } from 'react'

import { cls } from '@keg-hub/jsutils'
import { PanelHeader } from './PanelHeader'
import {
  PanelSidebar,
  PanelContent
} from './Panel.styled'
import { useMemo, useCallback, useState, useRef, useEffect } from 'react'

export const Panel = (props:TPanel) => {
  const {
    title,
    actions,
    children,
    startOpen,
    fillHeight,
    header=true,
    className=``
  } = props

  const panelRef = useRef<HTMLDivElement>(null)
  const lastHeightRef = useRef<number>(0) as MutableRefObject<number>
  const [closed, setCollapse] = useState(!startOpen)
  const onCollapse = useCallback((event:SyntheticEvent) => {
    const panel = panelRef.current as HTMLDivElement
    if(!panel) return

    // Panel currently closed - Switch the panel from closed to open
    if(closed === true){
      panel.style.maxHeight = lastHeightRef.current
        ? `${lastHeightRef.current}px`
        : `100vh`

      // IMPORTANT - timeout delay should match the transition time see ./Panel.css
      setTimeout(() => panel.style.maxHeight = ``, 300)
    }

    // Panel currently open - Switch the panel from open to closed
    else {
      lastHeightRef.current = panel.offsetHeight
      panel.style.maxHeight = `${lastHeightRef.current}px`
      setTimeout(() => panel.style.maxHeight = `0px`, 0)
    }

    setCollapse(!closed)
  }, [closed])

  useEffect(() => {
    const panel = panelRef.current as HTMLDivElement

    if(!panel) return
    lastHeightRef.current = panel.offsetHeight
  }, [])

  const style = useMemo(() => {
    return startOpen ? { maxHeight: `100vh` } : { maxHeight: `0px` }
  }, [startOpen])

  return (
    <PanelSidebar
      className={cls(`goblet-sidebar-panel`, className, closed ? `closed` : `open`)}
      sx={{
        flexGrow: fillHeight ? 1 : 0
      }}
    >
      {header && (
        <PanelHeader
          title={title}
          closed={closed}
          actions={actions}
          onCollapse={onCollapse}
        />
      )}
      <PanelContent
        style={style}
        ref={panelRef}
        className={cls(`goblet-sidebar-panel-content`, { hide: closed, show: !closed })}
      >
        {children}
      </PanelContent>
    </PanelSidebar>
  )
}
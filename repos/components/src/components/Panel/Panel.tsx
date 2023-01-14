import type { TPanel } from '../../types'
import type { SyntheticEvent, MutableRefObject } from 'react'

import { useMemo, useCallback, useState, useRef, useEffect } from 'react'
import { cls } from '@keg-hub/jsutils'
import { PanelHeader } from './PanelHeader'
import { useInline } from '@GBC/hooks/useInline'
import { PanelSidebar, PanelContent } from './Panel.styled'

export const Panel = (props:TPanel) => {
  const {
    title,
    onClick,
    actions,
    children,
    startOpen,
    fillHeight,
    headerHover,
    header=true,
    className=``,
    body=Boolean(children),
  } = props

  const panelRef = useRef<HTMLDivElement>(null)
  const lastHeightRef = useRef<number>(0) as MutableRefObject<number>
  const [closed, setCollapse] = useState(!startOpen)
  
  const onToggle = useInline(onClick)
  const onCollapse = useCallback((event:SyntheticEvent) => {
    const update = !closed

    onToggle?.(event, update)

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

    setCollapse(update)
  }, [closed])

  useEffect(() => {
    const panel = panelRef.current as HTMLDivElement

    if(!panel) return
    lastHeightRef.current = panel.offsetHeight
  }, [])

  const style = useMemo(() => {
    return {
      container: { flexGrow: fillHeight ? 1 : 0 },
      content: startOpen ? { maxHeight: `100vh` } : { maxHeight: `0px` }
    }
  }, [
    startOpen,
    fillHeight
  ])

  return (
    <PanelSidebar
      sx={style.container}
      className={cls(`goblet-sidebar-panel`, className, closed ? `closed` : `open`)}
    >
      {header && (
        <PanelHeader
          title={title}
          hasBody={body}
          closed={closed}
          actions={actions}
          onCollapse={onCollapse}
          headerHover={headerHover}
        />
      )}
      {body && (
        <PanelContent
          ref={panelRef}
          style={style.content}
          className={cls(`goblet-sidebar-panel-content`, { hide: closed, show: !closed })}
        >
          {children}
        </PanelContent>
      )}
    </PanelSidebar>
  )
}
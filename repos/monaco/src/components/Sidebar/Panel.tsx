import type { TPanel, TPanelHeaderAction } from '../../types'
import type { MutableRefObject, RefObject } from 'react'

import './Panel.css'
import { PanelHeader } from './PanelHeader'
import { useCallback, useState, useRef } from 'react'

export const Panel = (props:TPanel) => {
  const {
    title,
    actions,
    children,
    header=true,
    className=``
  } = props

  const panelRef = useRef<HTMLDivElement>(null)
  const lastHeightRef = useRef<number>(0) as MutableRefObject<number>
  const [closed, setCollapse] = useState(false)
  const onCollapse = useCallback(() => {
    const panel = panelRef.current as HTMLDivElement
    if(!panel) return

    if(closed === true){
      panel.style.maxHeight = `${lastHeightRef.current || '100vh'}px`
      // IMPORTANT - timeout delay should match the transition time see ./Panel.css
      setTimeout(() => panel.style.maxHeight = ``, 300)
    }
    else {
      lastHeightRef.current = panel.offsetHeight
      panel.style.maxHeight = `${lastHeightRef.current}px`
      setTimeout(() => panel.style.maxHeight = `0px`, 0)
    }

    setCollapse(!closed)
  }, [closed])

  const closedCls = closed ? `hide` : `show`

  return (
    <div className={`goblet-monaco-sidebar-panel ${className}`.trim()}>
      {header && (
        <PanelHeader
          title={title}
          closed={closed}
          actions={actions}
          onCollapse={onCollapse}
        />
      )}
      <div ref={panelRef} className={`goblet-monaco-sidebar-panel-content ${closedCls}`}>
        {children}
      </div>
    </div>
  )
}
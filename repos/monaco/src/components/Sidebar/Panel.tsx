import type { TPanelHeaderAction } from './PanelHeader'
import './Panel.css'
import { PanelHeader } from './PanelHeader'
import { useCallback, useState } from 'react'

export type TPanel = {
  title:string
  children?:any
  header?:boolean
  className?:string
  actions?:TPanelHeaderAction[]
}


export const Panel = (props:TPanel) => {
  const {
    title,
    actions,
    children,
    header=true,
    className=``
  } = props

  const [collapse, setCollapse] = useState(false)
  const onCollapse = useCallback(() => setCollapse(pre => !pre), [])

  const collapseCls = collapse ? `hide` : `show`

  return (
    <div className={`goblet-monaco-sidebar-panel ${className}`.trim()}>
      {header && (
        <PanelHeader
          title={title}
          actions={actions}
          collapse={collapse}
          onCollapse={onCollapse}
        />
      )}
      <div className={`goblet-monaco-sidebar-panel-content ${collapseCls}`}>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}
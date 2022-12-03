import type { TPanelHeaderAction } from './PanelHeader'

export type TPanel = {
  title:string
  children?:any
  header?:boolean
  className?:string
  actions?:TPanelHeaderAction[]
}

import { PanelHeader } from './PanelHeader'
import { useCallback, useState } from 'react'

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

  const collapseCls = collapse ? `collapsed` : ``

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
        {!collapse && children}
      </div>
    </div>
  )
}
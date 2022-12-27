import type { Modal } from '../Modal/Modal'
import type { MutableRefObject, CSSProperties } from 'react'
import type {
  TFilelist,
  TEditorCB,
  TSidebarPanel,
  TEditorConfig,
  TFileCallback,
} from '../../types'

import './Sidebar.css'
import { Panel } from './Panel'
import { FileTree } from '../FileTree'

export type TSidebar = {
  Modal: Modal
  title?: string
  PrePanels?:TSidebarPanel[]
  Panels?:TSidebarPanel[]
  rootPrefix?: string
  currentPath?: string
  sidebarWidth?: number
  style?: CSSProperties
  config?: TEditorConfig
  sidebarStatus?: boolean
  defaultFiles: TFilelist
  onPathChange: TEditorCB
  onDeleteFile: TEditorCB
  onAddFile: TFileCallback
  onDeleteFolder: TEditorCB
  onAddFolder: TFileCallback
  rootEl: HTMLElement | null
  onEditFileName: TFileCallback
  onEditFolderName: TFileCallback
  filesRef: MutableRefObject<TFilelist>
}

export const Sidebar = (props:TSidebar) => {

  const {
    style,
    Panels,
    PrePanels,
  } = props

  return (
    <div style={style} className='goblet-editor-sidebar-main' >
      {PrePanels?.length && PrePanels.map(panel => <Panel key={panel.title || panel.id} {...panel} />)}
      <FileTree {...props} />
      {Panels?.length && Panels.map(panel => <Panel key={panel.title || panel.id} {...panel} />)}
    </div>
  )
  
}
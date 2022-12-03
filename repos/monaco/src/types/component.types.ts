
import type { editor } from 'monaco-editor'

import type { TSidebarPanel } from '../components/Sidebar/Sidebar'
import type { Modal, TModalOpts } from '../components/Modal/Modal'
import type { TFolder, TFileItem, TFilelist } from './file.types'
import type { TEditorTheme, TEditorConfig } from './editor.types'
import type { MutableRefObject, CSSProperties, ReactNode, ComponentType } from 'react'
import type {
  TEditorCB,
  TFileCallback,
  TEditorFileCB,
  TEditorAddFile,
  TEditorPromiseCB,
  TEditorRenameFile,
} from './helpers.types'

export type TModal = Modal

export interface IMonacoEditorProps {
  title?: string
  Modal: TModalOpts
  rootPrefix?: string
  emptyText?: string
  defaultPath?: string
  sidebarWidth?: number
  Panels?:TSidebarPanel[]
  PrePanels?:TSidebarPanel[]
  config?: TEditorConfig
  sidebarStatus?: boolean
  defaultFiles?: TFilelist
  onPathChange?: TEditorCB
  onValueChange?: TEditorCB
  onDeleteFile?: TEditorCB
  onAddFile?: TEditorAddFile
  onSaveFile?: TEditorFileCB
  Divider?:ComponentType<any>
  onFileChange?: TEditorFileCB
  onLoadFile?: TEditorPromiseCB
  onRenameFile?: TEditorRenameFile
  onSidebarResize?: (width:number) => void
  options: editor.IStandaloneEditorConstructionOptions
}

export interface IMultiRefType {
  getAllValue: () => TFilelist
  getValue: (path: string) => string | null
  getSupportThemes: () => Array<string>
  setTheme: (name: string, theme?:TEditorTheme) => void
}

export type TMonacoEditor = IMonacoEditorProps & {
  Loading?: ReactNode
}

export type TIcon = {
  title?: string
  size?: string
  height?: string
  width?: string
  color?:string
  fill?:string
  className?:string
  style?: CSSProperties
  svgStyle?: CSSProperties
}

export type TFileProps = {
  file: TFileItem
  parent: TFolder
  Modal: TModal
  root: boolean
  rootPrefix?:string
  currentPath?: string
  onAddFile: TFileCallback
  onAddFolder: TFileCallback
  abortAddFile:TFileCallback
  onDeleteFile: TFileCallback
  abortAddFolder:TFileCallback
  onEditFileName: TFileCallback
  onDeleteFolder: TFileCallback
  onEditFolderName: TFileCallback
  onConfirmAddFile: TFileCallback
  onConfirmAddFolder: TFileCallback
  onPathChange: (key: string) => void
  filesRef: MutableRefObject<TFilelist>
}

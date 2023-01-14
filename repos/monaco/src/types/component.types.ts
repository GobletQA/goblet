import type Monaco from 'monaco-editor'

import type { Modal, TModalOpts } from '../components/Modal/Modal'
import type { TFolder, TFileItem, TFilelist } from './file.types'
import type { TEditorTheme, TEditorConfig } from './editor.types'
import type { MutableRefObject, ReactNode, ComponentType } from 'react'
import type { TSidebarAction, TSidebarPanel, TAction } from '@gobletqa/components'
import type {
  TEditorCB,
  TCodeEditor,
  TEditorOpts,
  TFileCallback,
  TEditorFileCB,
  TEditorAddFile,
  TCodeEditorRef,
  TOnEditorLoaded,
  TEditorPromiseCB,
  TEditorRenameFile,
} from './helpers.types'

export type TModal = Modal

export type TEditorAction = TAction<TCodeEditor, TCodeEditorRef>

export interface IMonacoEditorProps {
  title?: string
  Modal: TModalOpts
  rootPrefix?: string
  emptyText?: string
  options: TEditorOpts
  sidebarWidth?: number
  actionsOpen?:boolean
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
  onEditorBlur?: TEditorFileCB
  onEditorFocus?: TEditorFileCB
  onFileChange?: TEditorFileCB
  onLoadFile?: TEditorPromiseCB
  onEditorLoaded?:TOnEditorLoaded
  onRenameFile?: TEditorRenameFile
  style?: Record<string, string|number>
  onSidebarResize?: (width:number) => void
  portal?:string|MutableRefObject<HTMLElement>
  actions?:TEditorAction[] | TSidebarAction<TCodeEditor>[]
}

export interface IMultiRefType {
  getAllValue: () => TFilelist
  getValue: (path: string) => string | null
  getSupportThemes: () => Array<string>
  setTheme: (name: string, theme?:TEditorTheme) => void
}

export type TMonacoEditor = IMonacoEditorProps & {
  Loading?: ReactNode
  onMonacoLoaded?: (monaco:typeof Monaco) => any
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


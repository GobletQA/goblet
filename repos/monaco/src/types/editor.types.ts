import type { CSSProperties, ReactNode, MutableRefObject, ComponentType } from 'react'

import type Monaco from 'monaco-editor'
import type { editor } from 'monaco-editor'
import type { TMonacoDefinition } from './gherkin.types'
import type { TFilelist, TFileMeta } from './file.types'
import type { TDecorationFns } from './decorations.types'
import type { TModalOpts } from '../components/Modal/Modal'
import type { TSidebarAction, TSidebarPanel, TEditorAction } from '@gobletqa/components'
import type {
  TMonaco,
  TEditorCB,
  TCodeEditor,
  TEditorOpts,
  TEditorFileCB,
  TFileCallback,
  TEditorAddFile,
  TOnEditorLoaded,
  TEditorPromiseCB,
  TEditorRenameFile,
} from './helpers.types'


export type TEditorOpenFiles = TFileMeta[]


export type TAllowedFileTypes = {
  js: `javascript`,
  ts: `typescript`,
  jsx: `javascript`,
  tsx: `typescript`,
  feature: `gherkin`
  [key:string]: string
}

export type TGherkinConfig = {
  definitions: TMonacoDefinition[]
}

export type TTSCompileOpts = {
  allowJs: boolean
  allowNonTsExtensions: boolean
  allowSyntheticDefaultImports: boolean
}

export type TEditorThemeConfig = {
  name: string
  theme?: TEditorTheme
}

export type TTSConfig = {
  defaults: any
  compileOptions: TTSCompileOpts
}

export type TMonacoConfig = {
  languages?: string[]
  typescript?: TTSConfig
  [key: string]: any
}

export type TEditorConfig = {
  extraLibs?: any
  monaco?: TMonacoConfig
  gherkin?:TGherkinConfig
  theme?: TEditorThemeConfig
  [key: string]: any
}

export type TEditorTheme = editor.IStandaloneThemeData & {
  [key: string]: any
}

export type TEditorThemes = {
  [key: string]: TEditorTheme
}

export type TEditorRefHandle = {
  closeFile:TEditorCB
  decoration: TDecorationFns
  getAllValue:() => TFilelist
  getSupportThemes:() => string[],
  resizeSidebar:(width:number) => void
  getValue:(path:string) => string | null,
  openFile: (loc:string, content?:string|null) => void,
  setTheme:(name: string, themeObj?: TEditorTheme | undefined, monaco?:TMonaco) => Promise<void>
}

export interface IMonacoEditorProps {
  title?: string
  Modal: TModalOpts
  emptyText?: string
  rootPrefix?: string
  options: TEditorOpts
  actionsOpen?:boolean
  sidebarWidth?: number
  style?: CSSProperties
  config?: TEditorConfig
  sidebarStatus?: boolean
  Panels?:TSidebarPanel[]
  PrePanels?:TSidebarPanel[]
  defaultFiles?: TFilelist
  onDeleteFile?: TEditorCB
  onValueChange?: TEditorCB
  onAddFile?: TEditorAddFile
  onSaveFile?: TEditorFileCB
  Divider?:ComponentType<any>
  onPathChange?: TEditorFileCB
  onEditorBlur?: TEditorFileCB
  onFileChange?: TEditorFileCB
  onLoadFile?: TEditorPromiseCB
  onEditorFocus?: TEditorFileCB
  onBeforeAddFile?: TFileCallback
  onEditorLoaded?:TOnEditorLoaded
  onRenameFile?: TEditorRenameFile
  onSidebarResize?: (width:number) => void
  portal?:string|MutableRefObject<HTMLElement>
  actions?:TEditorAction[] | TSidebarAction<TCodeEditor>[]
}

export type TMonacoEditor = IMonacoEditorProps & {
  Loading?: ReactNode
  onMonacoLoaded?: (monaco:typeof Monaco) => any
}
import type { ReactNode, MutableRefObject, ComponentType } from 'react'

import type Monaco from 'monaco-editor'
import type { editor } from 'monaco-editor'
import type { TFilelist, TFileMeta } from './file.types'
import type { TDecorationFns } from './decorations.types'
import type { TModalOpts } from '../components/Modal/Modal'
import type { TMonacoDefinition, TMonaco } from './gherkin.types'
import type { TSidebarAction, TSidebarPanel, TEditorAction } from '@gobletqa/components'
import type {
  TEditorCB,
  TCodeEditor,
  TEditorOpts,
  TEditorFileCB,
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
  rootPrefix?: string
  emptyText?: string
  options: TEditorOpts
  sidebarWidth?: number
  actionsOpen?:boolean
  config?: TEditorConfig
  sidebarStatus?: boolean
  defaultFiles?: TFilelist
  onPathChange?: TEditorCB
  Panels?:TSidebarPanel[]
  PrePanels?:TSidebarPanel[]
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

export type TMonacoEditor = IMonacoEditorProps & {
  Loading?: ReactNode
  onMonacoLoaded?: (monaco:typeof Monaco) => any
}
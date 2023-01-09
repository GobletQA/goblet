import type { editor, Range } from 'monaco-editor'
import type { TEditorCB } from './helpers.types'
import type { TFilelist, TFileMeta } from './file.types'
import type { IEditor, TMonacoDefinition, TMonaco } from './gherkin.types'

export type TEditorOpenFiles = TFileMeta[]

export type TOnEditor = ((editor: IEditor) => void) | undefined

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

export type TDecorationCB = (...args:any[]) => void
export type TDecorationAdd = (location:string, decoration:TDecoration) => void
export type TDecorationUpdate = (location:string, decoration:TDecoration) => void

export type TDecoration = {
  range?: Range
  search?: string
  options: editor.IModelDecorationOptions
}

export type TDecorationFns = {
  add:TDecorationAdd
  clear:TDecorationCB
  remove:TDecorationCB
  update:TDecorationUpdate
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
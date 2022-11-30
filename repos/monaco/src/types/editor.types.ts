import type { editor } from 'monaco-editor'

export type TEditorOpenFiles = Array<{status?: string, path: string}>

export type TAllowedFileTypes = {
  less: 'less',
  js: 'javascript',
  ts: 'typescript',
  jsx: 'javascript',
  tsx: 'typescript',
  [key:string]: string
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
  theme?: TEditorThemeConfig
  [key: string]: any
}

export type TEditorTheme = editor.IStandaloneThemeData & {
  [key: string]: any
}

export type TEditorThemes = {
  [key: string]: TEditorTheme
}


export type TTSCompileOpts = {
  allowJs: boolean
  allowNonTsExtensions: boolean
  allowSyntheticDefaultImports: boolean
}

export interface TFilelist {
  [key: string]: string
}


export type TEditorConfig = {
  extraLibs: any
  [key: string]: any
}


export type TEditorTheme = {
  [key: string]: any
}
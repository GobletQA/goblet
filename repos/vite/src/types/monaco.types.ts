import type Monaco from 'monaco-editor'
import type { Range, TextEdit } from 'vscode-languageserver-types'
import type { editor as Editor, languages as Languages } from 'monaco-editor'

export type IEditor = Editor.IStandaloneCodeEditor | null

export type TMonaco = typeof Monaco
export {
  Range as TRange,
  TextEdit as TTextEdit,
  Languages as NLanguages
}
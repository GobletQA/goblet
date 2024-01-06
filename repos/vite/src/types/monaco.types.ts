import type {
  Range,
  Monaco,
  TextEdit,
  Languages,
  editor as Editor,
} from '@gobletqa/monaco'

export type IEditor = Editor.IStandaloneCodeEditor | null

export type TMonaco = typeof Monaco
export {
  Range as TRange,
  TextEdit as TTextEdit,
  Languages as NLanguages
}
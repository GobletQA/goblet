import type Monaco from 'monaco-editor'
import type { languages } from 'monaco-editor'

type TextEdit = languages.TextEdit
type TTextRange = TextEdit[`range`]

export type {
  editor,
  Range,
  IMarkdownString,
  languages as Languages,
} from 'monaco-editor'

export type {
  Monaco,
  TextEdit,
  TTextRange
}
import type { editor } from 'monaco-editor'
import type {
  TDecoration,
  TDecorationList,
} from '@GBM/types'


export const createDecoration = (
  decorationsList:TDecorationList,
  match:editor.FindMatch,
  decoration:TDecoration
) => {
  const range = match.range
  const { search, options } = decoration
  const decoId = `${range.startLineNumber}-${search}`
  
  decorationsList[decoId] = { options, range }

  return decorationsList
}
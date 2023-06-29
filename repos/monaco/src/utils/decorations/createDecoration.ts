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
  const { id, options } = decoration
  const decoId = id || options?.marginClassName || `${range.startLineNumber}`

  decorationsList[decoId] = { options, range }

  return decorationsList
}

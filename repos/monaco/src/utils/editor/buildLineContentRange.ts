import type { TCodeEditor } from '@GBM/types'
import type { editor, Position } from 'monaco-editor'

type TLineContentRange = {
  position?:Position
  model:editor.ITextModel
  editor:TCodeEditor | editor.IStandaloneCodeEditor | editor.ICodeEditor
}

/**
 * Builds a Range object that covers the only text content of a file
 */
export const buildLineContentRange = ({ model, position, editor }:TLineContentRange) => {
  position = position || editor.getPosition() as Position

  const startColumn = model.getLineFirstNonWhitespaceColumn(position.lineNumber)
  const endColumn = model.getLineLastNonWhitespaceColumn(position.lineNumber)

  return {
    endColumn,
    startColumn,
    endLineNumber: position.lineNumber,
    startLineNumber: position.lineNumber,
  }
}

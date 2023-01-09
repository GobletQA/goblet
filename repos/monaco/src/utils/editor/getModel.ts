import type { editor } from 'monaco-editor'
import type { TCodeEditor, ICodeEditor } from '@GBM/types'

export const getModel = (codeEditor:ICodeEditor|TCodeEditor) => {
  const editor = codeEditor as TCodeEditor
  return editor?.getModel?.() as editor.ITextModel
}
import type { editor } from 'monaco-editor'
import type { TCodeEditor, ICodeEditor } from '@GBM/types'

export const getModel = (codeEditor:ICodeEditor|TCodeEditor|editor.IStandaloneCodeEditor) => {
  const editor = codeEditor as editor.IStandaloneCodeEditor
  return editor?.getModel?.() as editor.ITextModel
}
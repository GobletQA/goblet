import type { editor, Position, IDisposable } from 'monaco-editor'
import type {
  TMonaco,
  TCodeEditor,
} from '@GBM/types'

import { GherkinLangID } from '@GBM/constants'

import { getModel } from '@GBM/utils/editor/getModel'
import { buildLineContentRange } from '@GBM/utils/editor/buildLineContentRange'

let _Dispose:IDisposable|undefined


const modifyContent = (
  model:editor.ITextModel,
  editorPos:Position
) => {
  const lineContent = model.getLineContent(editorPos.lineNumber).trim()

  return lineContent.startsWith(`#`)
    ? lineContent.replace(`#`, ``).trim()
    : `# ${lineContent}`
}


const removeCommentCmd = () => {
  _Dispose?.dispose?.()
  _Dispose = undefined
}

const addCommentCmd = (
  monaco:TMonaco,
  codeEditor:editor.IStandaloneCodeEditor,
) => {

  _Dispose = codeEditor.addAction({
    id: 'gherkin-comment-line',
    label: 'Comment Line',
    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash,
    ],

    run: (editor) => {
      const position = editor.getPosition() as Position
      const model = getModel(editor)

      if(!model || !position) return 

      const newContent = modifyContent(model, position)
      const range = buildLineContentRange({
        model,
        editor,
        position
      })

      editor.executeEdits("gherkin-comment", [
        { range: range, text: newContent }
      ])
    }
  })
}

export const handleCommentCmd = (
  monaco:TMonaco,
  codeEditor?:TCodeEditor|editor.IStandaloneCodeEditor,
) => {
  if(!codeEditor) return

  const model = getModel(codeEditor)
  if(!model) return

  const langId = model?.getLanguageId()

  langId !== GherkinLangID
    ? removeCommentCmd()
    : !_Dispose && addCommentCmd(monaco, codeEditor)
}
import type { editor } from 'monaco-editor'
import { ALLOWED_FILE_TYPES } from '../constants'


const updateModel = (model:editor.ITextModel, content:string) => {
  if (model.getValue() !== content) {
    // If a model exists, we need to update it's content
    // This is needed because the content for the file might have been modified externally
    // Use `pushEditOperations` instead of `setValue` or `applyEdits` to preserve undo stack
    model.pushEditOperations(
      [],
      [
        {
          range: model?.getFullModelRange(),
          text: content,
        },
      ],
      () => []
    )
  }

  return model
}

const createModel = (path:string, content:string) => {
  const type = path.indexOf('.') !== -1
    ? path.split('.').slice(-1)[0]
    : ALLOWED_FILE_TYPES.js

  const model = window.monaco.editor.createModel(
    content,
    ALLOWED_FILE_TYPES[type] || type,
    new window.monaco.Uri().with({ path, scheme: 'goblet' })
  )

  model.updateOptions({
    tabSize: 2,
    insertSpaces: true,
  })

  return model
}

export const createOrUpdateModel = (path: string, content: string) => {
  const model = window.monaco.editor.getModels().find(model => model.uri.path === path)
  model ? updateModel(model, content) : createModel(path, content)
}

import type { editor } from 'monaco-editor'
import { ALLOWED_FILE_TYPES } from '../../constants'
import { getModelFromPath } from './getModelFromPath'

export const updateModel = (model:editor.ITextModel, content:string|null) => {
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

const createModel = (loc:string, content:string|null) => {

  const type = loc.indexOf('.') !== -1
    ? loc.split('.').slice(-1)[0]
    : ALLOWED_FILE_TYPES.js

  const model = window.monaco.editor.createModel(
    content || ``,
    ALLOWED_FILE_TYPES[type] || type,
    new window.monaco.Uri().with({ path: loc, scheme: `goblet` })
  )

  // Model options get set on init
  // It might be good to re-init them here, but will need to validate
  // Also need to way to get access to the options within this method
  // model.updateOptions({
  //   tabSize: 2,
  //   insertSpaces: true,
  // })

  return model
}

export const createOrUpdateModel = (loc:string, content:string|null=null) => {
  // Only create models of files, not directories
  if(loc.startsWith(`/`) && loc.endsWith(`/`)) return

  const model = getModelFromPath(loc)
  return model
    ? updateModel(model, content)
    : createModel(loc, content)
}

import { EEditorType } from '@types'
import { appDispatch, getStore } from '@store'

const getType = (type:EEditorType, current:EEditorType) => {
  return EEditorType[type]
    ? EEditorType[type]
    : current !== EEditorType.code
      ? EEditorType.code
      : EEditorType.visual
}

export const onEditor = (type:EEditorType) => {
  const { app } = getStore().getState()
  const { editor } = app

  const editorType = getType(type, editor)

  appDispatch.setEditor(editorType)
}
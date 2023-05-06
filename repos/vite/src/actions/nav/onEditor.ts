import { EEditorType } from '@types'
import { appDispatch, getStore } from '@store'
import { EditorPathChangeEvt } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { updateUrlQuery } from '@utils/url/updateUrlQuery'

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
  if(editorType === editor) return

  EE.emit(EditorPathChangeEvt, { location: `` })
  updateUrlQuery({ editor: editorType }, true)

  appDispatch.setEditor(editorType)
}
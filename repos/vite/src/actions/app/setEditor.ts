import { EEditorType } from '@types'
import { EE } from '@services/sharedService'
import { appDispatch, getStore } from '@store'
import { EditorPathChangeEvt } from '@constants'
import { updateUrlQuery } from '@utils/url/updateUrlQuery'
import { navToggleTestRunsView } from '@actions/testRuns/navToggleTestRunsView'

const getType = (type:EEditorType, current:EEditorType) => {
  return EEditorType[type]
    ? EEditorType[type]
    : current !== EEditorType.code
      ? EEditorType.code
      : EEditorType.visual
}

export const setEditor = (type:EEditorType) => {
  /**
   * Check if the test runs view is open
   * If true is returned, then we can switch editor
   * Other wise editor switching it blocked
   */
  const shouldSwitch = navToggleTestRunsView()
  if(!shouldSwitch) return

  const { app } = getStore().getState()
  const { editor } = app

  const editorType = getType(type, editor)
  if(editorType === editor) return

  EE.emit(EditorPathChangeEvt, { location: `` })
  updateUrlQuery({ editor: editorType }, true)

  appDispatch.setEditor(editorType)
}
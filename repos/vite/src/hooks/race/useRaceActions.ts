import { EAstObject } from '@ltipton/parkin'
import type {
  TRaceStep,
  TStepMenuAction,
  TCustomMenuOnClick,
} from '@gobletqa/race'

import { getFileModel } from '@utils/files/getFileModel'
import { PlayCircleOutlineIcon } from '@gobletqa/components'
import {startBrowserPlay} from '@actions/runner/startBrowserPlay'
import {filterAstFromStep} from '@utils/features/filterAstFromStep'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'

const playFromStep:TCustomMenuOnClick<TRaceStep> = (evt, ctx) => {
  const { item:step, feature } = ctx
  const ast = filterAstFromStep({ step, feature })

  const location = feature.parent.location
  const fileModel = getFileModel(location)

  if(!fileModel)
    return console.warn(`Can not run tests, File model could not be found.`, location)

  clearEditorDecorations(location)

  startBrowserPlay({...fileModel, ast:[ast]})
} 

const stepActions:TStepMenuAction[] = [{
  closeMenu: true,
  text: `Play Step`,
  id: `play-from-step`,
  onClick: playFromStep,
  type: EAstObject.step,
  Icon: PlayCircleOutlineIcon,
}]

export const useRaceActions = () => {

  return {
    stepActions
  }
}
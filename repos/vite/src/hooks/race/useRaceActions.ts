import { EAstObject } from '@ltipton/parkin'
import type {
  TRaceStep,
  TStepMenuAction,
  TCustomMenuOnClick,
} from '@gobletqa/race'

import { getFileModel } from '@utils/files/getFileModel'
import {startBrowserPlay} from '@actions/runner/startBrowserPlay'
import { filterAstFromId } from '@utils/features/filterAstFromId'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'
import {
  PlaylistPlayIcon,
  PlayCircleOutlineIcon
} from '@gobletqa/components'

const playOnlyStep:TCustomMenuOnClick<TRaceStep> = (evt, ctx) => {
  const { item:step, feature } = ctx
  const ast = filterAstFromId({ id: step.uuid, feature, single: true })
  const location = feature.parent.location
  const fileModel = getFileModel(location)

  if(!fileModel)
    return console.warn(`Can not run tests, File model could not be found.`, location)

  clearEditorDecorations(location)

  startBrowserPlay(fileModel, { ast })
} 

const playFromStep:TCustomMenuOnClick<TRaceStep> = (evt, ctx) => {
  const { item:step, feature } = ctx
  const ast = filterAstFromId({ id: step.uuid, feature })
  const location = feature.parent.location
  const fileModel = getFileModel(location)

  if(!fileModel)
    return console.warn(`Can not run tests, File model could not be found.`, location)

  clearEditorDecorations(location)

  startBrowserPlay(fileModel, { ast })
}

const stepActions:TStepMenuAction[] = [
  {
    closeMenu: true,
    text: `Play Step`,
    id: `play-only-step`,
    onClick: playOnlyStep,
    type: EAstObject.step,
    Icon: PlayCircleOutlineIcon,
  },
  {
    closeMenu: true,
    dividerBottom: true,
    id: `play-from-step`,
    text: `Play From Step`,
    onClick: playFromStep,
    type: EAstObject.step,
    Icon: PlaylistPlayIcon,
  }
]

export const useRaceActions = () => {

  return {
    stepActions,
  }
}
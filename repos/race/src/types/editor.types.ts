import type { TRaceModels, TRaceModel } from './models.types'
import type { TRaceSteps } from './steps.types'
import type {MutableRefObject } from 'react'
import type {
  TStepsRef,
  TModelsRef,
  TOnModelCB,
  TOnReturnModelCB
} from './helpers.types'


export type TEditorRefs = {
  stepsRef: TStepsRef
  modelsRef: TModelsRef
}


export type TRaceEditorProps = {
  model?:TRaceModel
  steps:TRaceSteps
  models:TRaceModels
  firstModelActive?:boolean
  onModelChange?:TOnModelCB
  onModelUpdate?:TOnModelCB
  onBeforeModelChange?:TOnReturnModelCB
}
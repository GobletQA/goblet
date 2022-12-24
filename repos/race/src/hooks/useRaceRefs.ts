import type {
  TOnModelCB,
  TRaceSteps,
  TRaceModels,
  TRaceEditorProps,
  TOnReturnModelCB,
} from '../types'

import { useRef } from 'react'
import { noOp } from '@keg-hub/jsutils'


export const useRaceRefs = (props:TRaceEditorProps) => {
  const {
    steps,
    models,
    onModelChange=noOp,
    onModelUpdate=noOp,
    onBeforeModelChange=noOp as TOnReturnModelCB
  } = props

  const stepsRef = useRef<TRaceSteps>(steps)
  stepsRef.current = steps
  
  const modelsRef = useRef<TRaceModels>(models)
  modelsRef.current = models

  const onModelChangeRef = useRef<TOnModelCB>(onModelChange)
  onModelChangeRef.current = onModelChange

  const onModelUpdateRef = useRef<TOnModelCB>(onModelUpdate)
  onModelUpdateRef.current = onModelUpdate

  const onModelBeforeChangeRef = useRef<TOnReturnModelCB>(onBeforeModelChange)
  onModelBeforeChangeRef.current = onBeforeModelChange

  return {
    stepsRef,
    modelsRef,
    onModelChangeRef,
    onModelUpdateRef,
    onModelBeforeChangeRef
  }

}
import type {
  TSetModel,
  TRaceModel,
  TOnModelCBRef,
  TOnReturnModelCBRef,
} from '../types'

import { useCallback } from 'react'

import { deepMerge } from '@keg-hub/jsutils'

export type THModelCallbacks = {
  model?:TRaceModel
  setModel:TSetModel
  onModelChangeRef:TOnModelCBRef
  onModelUpdateRef:TOnModelCBRef
  onModelBeforeChangeRef:TOnReturnModelCBRef
}

export const useModelCallbacks = (props:THModelCallbacks) => {

  const {
    model,
    setModel,
    onModelChangeRef,
    onModelUpdateRef,
    onModelBeforeChangeRef
  } = props

  const _setModel = useCallback(async (mdl?:TRaceModel) => {
    if(mdl?.uuid === model?.uuid) return

    const beforeMdl = await onModelBeforeChangeRef.current?.(mdl, model)
    const updated = beforeMdl || mdl
    
    setModel(updated)
    onModelChangeRef.current?.(updated)

  }, [model?.uuid])

  const updateModel = useCallback(async (mdl?:TRaceModel) => {
    if(mdl?.uuid === model?.uuid) return

    const merged = deepMerge<TRaceModel>(model, mdl)
    const beforeMdl = await onModelBeforeChangeRef.current?.(merged, mdl, model)

    const updated = beforeMdl || merged

    onModelUpdateRef.current?.(updated, mdl, model)
    setModel(updated)
  }, [model])

  return {
    updateModel,
    setModel: _setModel,
  }

}
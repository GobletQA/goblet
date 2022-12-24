import type {
  TRaceModel,
  TOnModelCB,
  TOnModelCBRef,
  TOnReturnModelCBRef,
} from '../types'

import {
  memo,
  useMemo,
  useState,
  useContext,
  createContext,
} from 'react'

import { noOpObj } from '@keg-hub/jsutils'
import { useModelCallbacks } from '../hooks/useModelCallbacks'

export type TModelProvider = {
  children: any
  initialModel?:TRaceModel
  onModelChangeRef:TOnModelCBRef
  onModelUpdateRef:TOnModelCBRef
  onModelBeforeChangeRef:TOnReturnModelCBRef
}

export type TModelCtx = {
  model: TRaceModel
  setModel:TOnModelCB
  updateModel:TOnModelCB
}

type TModelChild = {
  children: any
}

export const ModelContext = createContext<TModelCtx>({} as TModelCtx)

export const useModel = () => {
  return useContext(ModelContext)
}

const ModelChild = memo((props:TModelChild) => {
  return (<>{props.children}</>)
})

export const ModelProvider = (props:TModelProvider) => {
  const {
    children,
    initialModel,
    onModelChangeRef,
    onModelUpdateRef,
    onModelBeforeChangeRef,
  } = props

  const [model, _setModel] = useState<TRaceModel|undefined>(initialModel)

  const {
    setModel,
    updateModel,
  } = useModelCallbacks({
    onModelChangeRef,
    onModelUpdateRef,
    setModel:_setModel,
    onModelBeforeChangeRef
  })

  const modelCtx:TModelCtx = useMemo(() => {
    return {
      setModel,
      updateModel,
      model: (model || noOpObj) as TRaceModel,
    }
  }, [model, setModel, updateModel])

  return (
    <ModelContext.Provider value={modelCtx}>
      <ModelChild children={children} />
    </ModelContext.Provider>
  )

}

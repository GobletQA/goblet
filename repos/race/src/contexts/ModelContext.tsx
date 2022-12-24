import type {
  TRaceModel,
  TOnModelCBRef,
  TOnReturnModelCBRef,
} from '../types'

import {
  memo,
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react'

import { useModelCallbacks } from '../hooks/useModelCallbacks'

export type TModelProvider = {
  children: any
  model?:TRaceModel
  onModelChangeRef:TOnModelCBRef
  onModelUpdateRef:TOnModelCBRef
  onModelBeforeChangeRef:TOnReturnModelCBRef
}

type TModelChild = {
  children: any
}

export const ModelContext = createContext<Record<string, any>>({})

export const useModel = () => {
  return useContext(ModelContext)
}

const ModelChild = memo((props:TModelChild) => {
  return (<>{props.children}</>)
})

export const ModelProvider = (props:TModelProvider) => {
  const {
    children,
    onModelChangeRef,
    onModelUpdateRef,
    model:propsModel,
    onModelBeforeChangeRef
  } = props

  const [model, _setModel] = useState<TRaceModel|undefined>(propsModel)

  const {
    setModel,
    updateModel,
  } = useModelCallbacks({
    onModelChangeRef,
    onModelUpdateRef,
    setModel:_setModel,
    onModelBeforeChangeRef
  })

  useEffect(() => {
    propsModel?.uuid !== model?.uuid && setModel(propsModel)
  }, [propsModel?.uuid, model?.uuid])

  const modelCtx = useMemo(() => {
    return { model, setModel, updateModel }
  }, [model, setModel, updateModel])

  return (
    <ModelContext.Provider value={modelCtx}>
      <ModelChild children={children} />
    </ModelContext.Provider>
  )

}

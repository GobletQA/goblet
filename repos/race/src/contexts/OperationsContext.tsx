import {
  EOperations,
  TRaceOpData,
  TSetOperations,
  TRaceOperations,
  TOnUpdateOperationEvt,
} from '@GBR/types'
import type { TRemoveStep } from '@GBR/actions/operations/removeStepOperation'
import { removeStepOperation } from '@GBR/actions/operations/removeStepOperation'

import { OnUpdateOperationEvent } from '@GBR/constants/events'
import { useInline, MemoChildren, useOnEvent } from '@gobletqa/components'
import {
  useMemo,
  useState,
  useContext,
  createContext,
} from 'react'

export type TOperationsProvider = {
  children:any
}

export type TOperationsCtx = {
  operations:TRaceOperations
  setOperations:TSetOperations
}

export const OperationsContext = createContext<TOperationsCtx>({} as TOperationsCtx)
export const useOperations = () => useContext(OperationsContext)

export const OperationsProvider = (props:TOperationsProvider) => {
  const { children } = props
  const [operations, _setOperations] = useState<TRaceOperations>({})

  const setOperations = useInline<TSetOperations>((update) => {
    const { type, data } = update
    // TODO: add other cut operations here for  
    if(data?.from === EOperations.cut){
      ;(`step` in data.item)
        && removeStepOperation({...data} as TRemoveStep)
    }

    type && _setOperations({...operations, [type]: data })
  })

  useOnEvent<TOnUpdateOperationEvt>(OnUpdateOperationEvent, setOperations)

  const operationsCtx:TOperationsCtx = useMemo(() => ({
    operations,
    setOperations,
  }), [
    operations
  ])

  return (
    <OperationsContext.Provider value={operationsCtx}>
      <MemoChildren children={children} />
    </OperationsContext.Provider>
  )

}


import type { TRemoveStep } from '@GBR/actions/operations/removeStepOperation'
import {
  EOperations,
  TSetOperations,
  TRaceOperations,
  TOnUpdateOperationEvt,
} from '@GBR/types'

import { OnUpdateOperationEvent } from '@GBR/constants/events'
import { MemoChildren, useOnEvent } from '@gobletqa/components'
import { removeStepOperation } from '@GBR/actions/operations/removeStepOperation'
import {
  useMemo,
  useState,
  useContext,
  useCallback,
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

  const setOperations = useCallback<TSetOperations>((update) => {
    const { type, data } = update
    // TODO: add other cut operations here
    if(data?.from === EOperations.cut){
      ;(`step` in data.item)
        && removeStepOperation({...data} as TRemoveStep)
    }

    type && _setOperations({...operations, [type]: data })
  }, [operations])

  useOnEvent<TOnUpdateOperationEvt>(OnUpdateOperationEvent, setOperations)

  const operationsCtx:TOperationsCtx = useMemo(() => ({
    operations,
    setOperations,
  }), [
    operations,
    setOperations,
  ])

  return (
    <OperationsContext.Provider value={operationsCtx}>
      <MemoChildren children={children} />
    </OperationsContext.Provider>
  )

}


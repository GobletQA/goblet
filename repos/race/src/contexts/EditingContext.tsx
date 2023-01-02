import type {
 TEditing,
 TEditingCtx,
 TEditingAction,
 TEditingPayload
} from '@GBR/types'

import { MemoChildren } from '@gobletqa/components'
import { useEffectOnce } from '@gobletqa/components'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { DispatchEditingActionEvt } from '@GBR/constants'

import {
  useMemo,
  useReducer,
  useContext,
  createContext,
} from 'react'

export type TEditingProvider = {
  children:any
}

const actions = {
  SetEditing: `SetEditing`,
  StopEditing: `StopEditing`,
  ClearEditing: `ClearEditing`,
}

export const EditingContext = createContext<TEditingCtx>({} as TEditingCtx)

export const useEditing = () => {
  return useContext(EditingContext)
}


const editingReducer = (state:TEditing, action:TEditingAction) => {
  switch (action.type) {
    case actions.ClearEditing: {
      return {}
    }
    case actions.SetEditing: {
      return action?.payload?.key
        ? { ...state, [action?.payload?.key]: action.payload.value }
        : state
    }
    case actions.StopEditing: {
      return action.payload?.key
        ? { ...state, [action.payload?.key]: undefined }
        : state
    }
    default:
      return state
  }
}


const useEditingContext = () => {
  const [state, dispatch] = useReducer(editingReducer, {});

  const context = useMemo(() => {
    return {
      editing: state,
      clearEditing: () => {
        dispatch({ type: actions.ClearEditing })
      },
      setEditing: (payload:TEditingPayload) => {
        dispatch({ type: actions.SetEditing, payload })
      },
      stopEditing: (payload:Omit<TEditingPayload, `value`>) => {
        dispatch({ type: actions.StopEditing, payload } as TEditingAction)
      },
    }
  }, [state, dispatch])

  // Listen to external events to update the editing context
  // Allows dispatching update outside of the react context
  useEffectOnce(() => {
    const dispatchOff = EE.on<TEditingAction>(DispatchEditingActionEvt, (action) => dispatch(action))

    return () => {
      dispatchOff?.()
    }
  })

  return context
}

export const EditingProvider = (props:TEditingProvider) => {

  const editingCtx:TEditingCtx = useEditingContext()

  return (
    <EditingContext.Provider value={editingCtx}>
      <MemoChildren {...props} />
    </EditingContext.Provider>
  )

}

import type { TAction } from '@reducers'
import { ModalTypes } from '@constants'
import { deepMerge } from '@keg-hub/jsutils'


export type TModalState = {
  type?: ModalTypes
  visible: boolean
  modalProps?: Record<any, any>
}

export const modalState = {} as TModalState

export const modalActions = {
  clear: (state:TModalState, action:TAction<TModalState>) => (modalState),
  setModal: (state:TModalState, action:TAction<TModalState>) => action?.payload,
  upsertModal: (state:TModalState, action:TAction<TModalState>) => deepMerge<TModalState>(state, action?.payload),
  setVisible: (state:TModalState, action:TAction<boolean>) => {
    return {
      ...state,
      visible: action?.payload
    }
  }
}


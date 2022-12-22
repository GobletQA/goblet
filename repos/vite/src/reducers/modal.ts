import type { TAction } from '@types'

import { EModalTypes } from '@types'
import { deepMerge } from '@keg-hub/jsutils'


export type TModalState = {
  type?: EModalTypes
  visible: boolean
  modalProps?: Record<any, any>
}

export const modalState = {} as TModalState

export const modalActions = {
  clearModal: (state:TModalState, action:TAction<TModalState>) => (modalState),
  setModal: (state:TModalState, action:TAction<TModalState>) => action?.payload,
  upsertModal: (state:TModalState, action:TAction<TModalState>) => deepMerge<TModalState>(state, action?.payload),
  setModalVisible: (state:TModalState, action:TAction<boolean>) => {
    return {
      ...state,
      visible: action?.payload
    }
  }
}


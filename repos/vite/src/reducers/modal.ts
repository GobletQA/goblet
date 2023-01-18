import type { TDspAction } from '@types'

import { EModalTypes } from '@types'
import { deepMerge } from '@keg-hub/jsutils'


export type TModalState = {
  type?: EModalTypes
  visible: boolean
  modalProps?: Record<any, any>
}

export const modalState = {} as TModalState

export const modalActions = {
  clearModal: (state:TModalState, action:TDspAction<TModalState>) => (modalState),
  setModal: (state:TModalState, action:TDspAction<TModalState>) => action?.payload,
  upsertModal: (state:TModalState, action:TDspAction<TModalState>) => deepMerge<TModalState>(state, action?.payload),
  setModalVisible: (state:TModalState, action:TDspAction<boolean>) => {
    return {
      ...state,
      visible: action?.payload
    }
  }
}


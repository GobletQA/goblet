import type { TDspAction } from '@types'
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'

import { EModalTypes } from '@types'
import { deepMerge } from '@keg-hub/jsutils'
import { createReducer, createAction } from '@reduxjs/toolkit'

export type TModalState = {
  type?: EModalTypes
  visible: boolean
  modalProps?: Record<any, any>
}

export const modalState = {} as TModalState

const setModal = createAction<TModalState>(`setModal`)
const clearModal = createAction<TModalState>(`clearModal`)
const upsertModal = createAction<TModalState>(`upsertModal`)
const setModalVisible = createAction<boolean>(`setModalVisible`)

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

export const modalReducer = createReducer(
  deepMerge(modalState),
  (builder:ActionReducerMapBuilder<TModalState>) => {
    builder.addCase(clearModal, modalActions.clearModal)
    builder.addCase(setModal, modalActions.setModal)
    builder.addCase(upsertModal, modalActions.upsertModal)
    builder.addCase(setModalVisible, modalActions.setModalVisible)
  }
)

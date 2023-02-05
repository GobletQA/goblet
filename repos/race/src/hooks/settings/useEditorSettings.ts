import type {
  TActionMethod,
  TSettingsState,
  TSettingUpdate,
  TSettingAction,
  TUpdateSettingEvt,
} from '@GBR/types'

import { useReducer } from 'react'
import { exists } from '@keg-hub/jsutils'
import { ESettingAction } from '@GBR/types'
import { UpdateSettingContextEvt } from '@GBR/constants'
import { useEventListen, useEventEmit, useInline } from '@gobletqa/components'

export type THEditorSettings = {
  displayGeneral?:boolean
}


const SettingActions:Record<string, TActionMethod> = {
  [ESettingAction.ToggleGeneral]: (state:TSettingsState, action:TSettingAction) => {
    const { payload } = action
    return payload.displayGeneral !== state.displayGeneral
      ? { ...state, displayGeneral: payload.displayGeneral }
      : state
  },
  [ESettingAction.Settings]: (state:TSettingsState, action:TSettingAction) => {
    return {
      ...state,
      ...action.payload
    }
  },
  [ESettingAction.Setting]: (state:TSettingsState, action:TSettingAction) => {
    const updated = { ...state }
    Object.entries(action.payload)
      .forEach(([key, value]) => {
        updated[key as keyof TSettingsState] = value
      })

    return updated
  }
}

const reducer = (state:THEditorSettings, action:TSettingAction) => {
  return SettingActions[action.type]?.(state, action) || state
}


export const useEditorSettings = (props:THEditorSettings) => {
  const {
    displayGeneral
  } = props
  
  const [state, dispatch] = useReducer(reducer, { displayGeneral })

  const toggleGeneral = useInline((toggle?:boolean) => {
    const displayGeneral = exists(toggle) ? toggle : !state.displayGeneral
    
    dispatch({
      type: ESettingAction.ToggleGeneral,
      payload: { displayGeneral }
    })
  })
  
  const updateSettings = useInline((settings:TSettingUpdate) => {
    dispatch({
      type: ESettingAction.Settings,
      payload: settings
    })
  })

  const updateSetting = useInline((settings:TSettingUpdate) => {
    dispatch({
      type: ESettingAction.Setting,
      payload: settings
    })
  })

  useEventListen<TUpdateSettingEvt>(
    UpdateSettingContextEvt,
    ({ payload }) => updateSetting(payload)
  )

  return {
    state,
    dispatch,
    toggleGeneral,
    updateSetting,
    updateSettings,
  }

}
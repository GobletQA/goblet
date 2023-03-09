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
  displayMeta?:boolean
}


const SettingActions:Record<string, TActionMethod> = {
  [ESettingAction.ToggleMeta]: (state:TSettingsState, action:TSettingAction) => {
    const { payload } = action
    return payload.displayMeta !== state.displayMeta
      ? { ...state, displayMeta: payload.displayMeta }
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
    displayMeta
  } = props
  
  const [state, dispatch] = useReducer(reducer, { displayMeta })

  const toggleMeta = useInline((toggle?:boolean) => {
    const displayMeta = exists(toggle) ? toggle : !state.displayMeta
    
    dispatch({
      type: ESettingAction.ToggleMeta,
      payload: { displayMeta }
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
    toggleMeta,
    updateSetting,
    updateSettings,
  }

}
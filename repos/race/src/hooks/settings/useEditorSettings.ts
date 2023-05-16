import type {
  TOnSettingCB,
  TActionMethod,
  TRaceSettings,
  TSettingUpdate,
  TSettingPayload,
  TSettingsAction,
  TUpdateSettingEvt,
} from '@GBR/types'

import { useReducer } from 'react'
import { exists } from '@keg-hub/jsutils'
import { ESettingAction } from '@GBR/types'
import { UpdateSettingContextEvt } from '@GBR/constants'
import { useOnEvent, useInline } from '@gobletqa/components'

export type THEditorSettings = TRaceSettings & {
  onSettingChange?:TOnSettingCB
}


const SettingActions:Record<string, TActionMethod> = {
  [ESettingAction.ToggleMeta]: (state:TRaceSettings, action:TSettingsAction) => {
    const { payload } = action
    return payload.displayMeta !== state.displayMeta
      ? { ...state, displayMeta: payload.displayMeta }
      : state
  },
  [ESettingAction.Settings]: (state:TRaceSettings, action:TSettingsAction) => {
    return {
      ...state,
      ...action.payload
    }
  },
}

const reducer = (state:TRaceSettings, action:TSettingsAction) => {
  return SettingActions[action.type]?.(state, action) || state
}

export const useEditorSettings = (props:THEditorSettings) => {
  const {
    onSettingChange,
    ...settings
  } = props
  
  const [state, dispatch] = useReducer(reducer, settings)

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

  const updateSetting = useInline((payload:TSettingPayload) => {
    const doUpdate = Boolean(payload.setting && payload.setting in state)
    if(!doUpdate)
      return console.warn(`[Error - Race Setting] Invalid setting payload "${payload.setting}:${payload.value}"`)

    onSettingChange?.(payload)
    dispatch({
      type: ESettingAction.Settings,
      payload: { [payload.setting]: payload.value }
    })
  })

  useOnEvent<TUpdateSettingEvt>(
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
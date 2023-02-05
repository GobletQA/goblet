import type {
  TSettingUpdate,
  TSettingsState
} from '../types'

import {
  useMemo,
  useContext,
  createContext,
} from 'react'

import { MemoChildren } from '@gobletqa/components'
import { useEditorSettings } from '@GBR/hooks/settings/useEditorSettings'


export type TSettingsProvider = {
  children:any
  displayGeneral?:boolean
}

export type TSettingsCtx = {
  settings:TSettingsState
  toggleGeneral:(toggle?:boolean) => void
  updateSetting:(settings:TSettingUpdate) => void
  updateSettings:(settings:TSettingUpdate) => void
}

export const SettingsContext = createContext<TSettingsCtx>({} as TSettingsCtx)
export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = (props:TSettingsProvider) => {

  const {
    children,
    ...rest
  } = props

  const {
    state,
    toggleGeneral,
    updateSetting,
    updateSettings,
  } = useEditorSettings(rest)

  const settingsCtx:TSettingsCtx = useMemo(() => {
    return {
      toggleGeneral,
      updateSetting,
      updateSettings,
      settings: state,
    }
  }, [
    toggleGeneral,
    updateSetting,
    updateSettings,
    state.displayGeneral
  ])

  return (
    <SettingsContext.Provider value={settingsCtx}>
      <MemoChildren children={children} />
    </SettingsContext.Provider>
  )

}

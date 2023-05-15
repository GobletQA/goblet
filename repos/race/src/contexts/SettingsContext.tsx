import type {
  TRaceSettings,
  TSettingUpdate,
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
  displayMeta?:boolean
}

export type TSettingsCtx = {
  settings:TRaceSettings
  toggleMeta:(toggle?:boolean) => void
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
    toggleMeta,
    updateSetting,
    updateSettings,
  } = useEditorSettings(rest)

  const settingsCtx:TSettingsCtx = useMemo(() => {
    return {
      toggleMeta,
      updateSetting,
      updateSettings,
      settings: state,
    }
  }, [
    toggleMeta,
    updateSetting,
    updateSettings,
    state.displayMeta
  ])

  return (
    <SettingsContext.Provider value={settingsCtx}>
      <MemoChildren children={children} />
    </SettingsContext.Provider>
  )

}

import type {
  TOnSettingCB,
  TRaceSettings,
  TSettingUpdate,
  TSettingPayload,
} from '../types'
import { ReactNode } from 'react'
import {
  useMemo,
  useContext,
  createContext,
} from 'react'

import { MemoChildren } from '@gobletqa/components'
import { useEditorSettings } from '@GBR/hooks/settings/useEditorSettings'


export type TSettingsProvider = TRaceSettings & {
  children:ReactNode
  onSettingChange?:TOnSettingCB
}

export type TSettingsCtx = {
  settings:TRaceSettings
  toggleMeta:(toggle?:boolean) => void
  updateSetting:(settings:TSettingPayload) => void
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
      settings:state,
    }
  }, [
    state,
    toggleMeta,
    updateSetting,
    updateSettings,
  ])

  return (
    <SettingsContext.Provider value={settingsCtx}>
      <MemoChildren children={children} />
    </SettingsContext.Provider>
  )

}

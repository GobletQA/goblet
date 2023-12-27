import type { ReactNode } from 'react'
import type {
  TOnSettingCB,
  TRaceSettings,
  TSettingUpdate,
  TAskForSettings,
  TSettingPayload,
} from '../types'

import { AskForSettingsEvt } from '@GBR/constants'
import { MemoChildren, useOnEvent } from '@gobletqa/components'
import { useEditorSettings } from '@GBR/hooks/settings/useEditorSettings'
import {
  useMemo,
  useContext,
  createContext,
} from 'react'

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

  // Helper to allow external code ask the context for the settings
  // Allows external actions to interface with the settings
  useOnEvent<TAskForSettings>(AskForSettingsEvt, ({ cb }) => cb?.(settingsCtx))

  return (
    <SettingsContext.Provider value={settingsCtx}>
      <MemoChildren children={children} />
    </SettingsContext.Provider>
  )

}

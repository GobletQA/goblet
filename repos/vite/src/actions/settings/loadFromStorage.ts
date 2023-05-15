import { settingsDispatch } from '@store'
import { get, exists } from '@keg-hub/jsutils'
import { settingActions } from './settingActions'
import { loadSettings } from '@utils/settings/loadSettings'
import { toggleSidebarLocked } from '../nav/toggleSidebarLocked'
import { SettingsLoadActions } from '@constants/settings'


export const loadFromStorage = async () => {
  const settings = await loadSettings()

  SettingsLoadActions.forEach((setting) => {
    const payload = get(settings, setting)
    exists(payload) && settingActions?.[setting]?.(payload)
  })

  settingsDispatch.setAllSettings(settings)

}
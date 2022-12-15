import { settingsDispatch } from '@store'
import { loadSettings } from '@utils/settings/loadSettings'

export const loadFromStorage = async () => {
  const settings = await loadSettings()
  settingsDispatch.setAllSettings(settings)
}
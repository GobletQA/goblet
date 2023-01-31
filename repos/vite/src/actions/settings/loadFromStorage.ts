import { settingsDispatch } from '@store'
import { get, exists } from '@keg-hub/jsutils'
import { loadSettings } from '@utils/settings/loadSettings'
import { toggleSidebarLocked } from '../nav/toggleSidebarLocked'

export const loadFromStorage = async () => {
  const settings = await loadSettings()
  
  // Update the sidebar based on users setting if it exists
  const sidebarLocked =  get(settings, `goblet.sidebarLocked.value`)
  exists(sidebarLocked) && toggleSidebarLocked(sidebarLocked)

  settingsDispatch.setAllSettings(settings)

}
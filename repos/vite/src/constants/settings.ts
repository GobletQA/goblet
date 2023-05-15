import { deepFreeze } from '@keg-hub/jsutils'
export const SettingMultiFeatsErr = `race.multiFeatsErr`
export const SettingSidebarLocked = `goblet.sidebarLocked`

export const SettingsLoadActions = deepFreeze<string[]>([
  SettingSidebarLocked,
  SettingMultiFeatsErr
])
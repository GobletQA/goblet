import { deepFreeze } from '@keg-hub/jsutils'

export const StorageKeys = deepFreeze({
  JWT: `goblet-jwt`,
  REPO: `goblet-repo`,
  USER: `goblet-user`,
  SETTINGS: `goblet-settings`,
  THEME_TYPE: `goblet-theme-type`,
  ROUTE_HEADERS: `goblet-route-headers`,
  LAST_OPENED_FILES: `goblet-last-opened-files`,
})

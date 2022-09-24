import { deepFreeze } from '@keg-hub/jsutils'

export const STORAGE = deepFreeze({
  JWT: `goblet-jwt`,
  REPO: `goblet-repo`,
  USER: `goblet-user`,
  ROUTE_HEADERS: `goblet-route-headers`,
})

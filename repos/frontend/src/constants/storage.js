import { deepFreeze } from '@keg-hub/jsutils'

export const storage = deepFreeze({
  STORAGE: {
    JWT: `jwt`,
    REPO: 'repo',
    USER: 'user',
    ROUTE_HEADERS: `route-headers`,
    SC_PORT: `screencast-port`
  },
})

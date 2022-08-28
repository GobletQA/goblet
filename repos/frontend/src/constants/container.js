import { deepFreeze } from '@keg-hub/jsutils'

const STATE = {
  ERROR: `Error`,
  MISSING: `Missing`,
  RUNNING: `Running`,
  STOPPED: `Stopped`,
  CREATING: `Creating`,
}

export const container = deepFreeze({
  CONTAINER: {
    STATE
  }
})

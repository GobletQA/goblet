import { bdd } from './bdd'
import { unit } from './unit'
import { kube } from './kube'
import { deploy } from './deploy'
import { docker } from './docker'
import { devspace } from './devspace'
// import { metadata } from './metadata'
// import { waypoint } from './waypoint'
import { screencast } from './screencast'
import { inDocker } from '@keg-hub/cli-utils'
import { initialize } from '../utils/helpers/initDefs'


const { GOBLET_RUN_FROM_CI, GOBLET_RUN_FROM_UI, KEG_CLI_TASK_RUNNING } = process.env

const definitions = () => {
  return !inDocker() && !GOBLET_RUN_FROM_CI && !GOBLET_RUN_FROM_UI && !KEG_CLI_TASK_RUNNING
    ? {
        ...initialize({ kube }),
        ...initialize({ deploy }),
        ...initialize({ docker }),
        ...initialize({ devspace }),
      }
    : {}
}

const tasks = {
  ...definitions(),
  ...initialize({ bdd }),
  ...initialize({ unit }),
  // ...initialize({ waypoint }),
  // ...initialize({ metadata }),
  ...initialize({ screencast }),
}

export default tasks

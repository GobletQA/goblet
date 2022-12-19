import { bdd } from './bdd'
import { unit } from './unit'
import { waypoint } from './waypoint'
import { metadata } from './metadata'
import { initialize } from '../utils/helpers/initDefs'

const tasks = {
  ...initialize({ bdd }),
  ...initialize({ unit }),
  ...initialize({ waypoint }),
  ...initialize({ metadata }),
}

export default tasks

/**
 * Loads only the tasks needed to execute tests
 * This allows them to follow a different path to execute tests than normal tasks
 * Which does not load all tasks, only those needed to run goblet tests
 */
import { bdd } from './bdd'
import { unit } from './unit'
import { waypoint } from './waypoint'
import { initialize } from '../utils/helpers/initDefs'

module.exports = {
  ...initialize({ bdd }),
  ...initialize({ unit }),
  ...initialize({ waypoint }),
}

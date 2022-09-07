/**
 * Loads only the tasks needed to execute tests
 * This allows them to follow a different path to execute tests than normal tasks
 * Which does not load all tasks, only those needed to run goblet tests
 */
 
const { initialize } = require('../utils/helpers/initDefs')

module.exports = {
  ...initialize(require('./bdd')),
  ...initialize(require('./unit')),
  ...initialize(require('./waypoint'))
}

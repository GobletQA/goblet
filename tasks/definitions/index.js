const { initialize } = require('../utils/helpers/initDefs')
const { GOBLET_RUN_FROM_CI } = process.env


const definitions = () => {
  return !GOBLET_RUN_FROM_CI
    ? {
        ...initialize(require('./kube')),
        ...initialize(require('./docker')),
        ...initialize(require('./devspace')),
        ...initialize(require('./metadata')),
      }
    : {}
}

module.exports = {
  ...definitions(),
  ...initialize(require('./bdd')),
  ...initialize(require('./unit')),
  ...initialize(require('./waypoint'))
}

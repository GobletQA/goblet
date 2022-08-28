const { inDocker } = require('@keg-hub/cli-utils')
const { initialize } = require('../utils/helpers/initDefs')
const { GOBLET_RUN_FROM_CI, GOBLET_RUN_FROM_UI } = process.env

const definitions = () => {
  return !inDocker() && !GOBLET_RUN_FROM_CI && !GOBLET_RUN_FROM_UI
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

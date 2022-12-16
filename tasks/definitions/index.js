const { inDocker } = require('@keg-hub/cli-utils')
const { initialize } = require('../utils/helpers/initDefs')
const { GOBLET_RUN_FROM_CI, GOBLET_RUN_FROM_UI, KEG_CLI_TASK_RUNNING } = process.env

const definitions = () => {
  return !inDocker() && !GOBLET_RUN_FROM_CI && !GOBLET_RUN_FROM_UI && !KEG_CLI_TASK_RUNNING
    ? {
        ...initialize(require('./kube')),
        ...initialize(require('./deploy')),
        ...initialize(require('./docker')),
        ...initialize(require('./devspace')),
      }
    : {}
}

module.exports = {
  ...definitions(),
  ...initialize(require('./bdd')),
  ...initialize(require('./unit')),
  ...initialize(require('./metadata')),
  ...initialize(require('./waypoint')),
  ...initialize(require('./screencast')),
}

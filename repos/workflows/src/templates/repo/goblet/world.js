const { deepMerge } = require('@keg-hub/jsutils')
const environment = require(`./environments`)[process.env.NODE_ENV]

// Add default world values
const world = deepMerge({
  app: {},
  data: {},
  context: {},
  $alias: {},
}, environment)

module.exports = {
  world
}

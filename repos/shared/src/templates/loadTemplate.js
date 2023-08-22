const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')
const { template } = require('@keg-hub/jsutils/template')
const { getFileContent } = require('@GSH/utils/getFileContent')

// If default template location not found, fallback to other repos
// Path does not included in bundled code, so when running the bundle app
// We have to use defined it's location in the consuming apps tsconfig.json
// Because it's not required or imported
const templateLoc = aliases[`@GSH/templates`]
  || aliases[`@GBE/Templates`]
  || aliases[`@GSC/Templates`]

const templates = {
  reports404: path.join(templateLoc, 'reports.404.html'),
  page404: path.join(templateLoc, 'page.404.html'),
  feature: path.join(templateLoc, 'feature.template.feature'),
  definition: path.join(templateLoc, 'definition.template.js'),
  support: path.join(templateLoc, 'support.template.js'),
  emptyJS: path.join(templateLoc, 'empty.template.js'),
  unit: path.join(templateLoc, 'unit.template.js'),
  waypoint: path.join(templateLoc, 'waypoint.template.js'),
}

const loadTemplate = async (name, data, altName) => {
  const content = await getFileContent(templates[name] || templates[altName] || templates.page404)
  return template(content, data)
}

module.exports = {
  loadTemplate,
}

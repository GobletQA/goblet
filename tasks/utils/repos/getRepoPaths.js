const path = require('path')
const { existsSync } = require('fs')
const { execSync } = require('child_process')
const { camelCase } = require('@keg-hub/jsutils')
const reposPath = path.join(__dirname, '../../../', 'repos')

/**
 * Finds all sub-repo paths from the <root>/repos directory
 * @type {function}
 *
 * @return {Object} - Found repo paths by camel-case name
 */
const getRepoPaths = () => {
  // list of the repo names located at `<root>/repos`
  return execSync('ls', { cwd: reposPath })
    .toString()
    .split('\n')
    .filter(Boolean)
    .reduce((values, name) => {
      const repo = path.join(reposPath, name)
      existsSync(path.join(repo, `./package.json`)) && (values[camelCase(name)] = repo)

      return values
    }, {})
}

module.exports = {
  getRepoPaths,
}

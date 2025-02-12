/**
 * Server specific constants / envs only
 * Only values needed to run the backend / socket / screencast servers
 * Client specific config should not be loaded from here
 */

const path = require('path')
const { readdirSync } = require('fs')
const { GobletRoot } = require('./gobletRoot')
const { snakeCase } = require('@keg-hub/jsutils/snakeCase')
const { deepFreeze } = require('@keg-hub/jsutils/deepFreeze')
const reposDir = path.join(GobletRoot, 'repos')


/**
 * Finds all sub-repo paths from the <goblet-root>/repos directory
 *
 * @type {Object} - Key/Value pair of Goblet sub-repos paths converted into snakeCase
 */
const getDirectories = (source, existing) => {
  return readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() || dirent.isSymbolicLink())
    .map(dirent => dirent.name)
    .reduce(
      (values, name) => {
        const key = snakeCase(name + 'Path').toUpperCase()
        values[key] = path.join(source, name)
        return values
      },
      existing || {}
    )
}
const repoPaths = getDirectories(reposDir, { REPOS_PATH: reposDir })


const {
  GOBLET_WORK_DIR = `goblet`,
  GOBLET_ARTIFACTS_DIR = `artifacts`,
  GOBLET_ENVIRONMENTS_DIR = `environments`,
  GOBLET_REPORTS_DIR = `artifacts/reports`,
  GOBLET_FEATURES_DIR = `bdd/features`,
  GOBLET_STEPS_DIR = `bdd/steps`,
  GOBLET_SUPPORT_DIR = `bdd/support`,
  GOBLET_UNIT_DIR = `unit`,
  GOBLET_WAYPOINT_DIR = `waypoint`,
  GOBLET_WORLD_FILE=`world.json`,
  GOBLET_PW_METADATA_DIR,
} = process.env

/**
 * Constants that define overridable location to test directories
 */
const dirsFromEnvs = deepFreeze({
  GOBLET_WORK_DIR,
  GOBLET_UNIT_DIR,
  GOBLET_STEPS_DIR,
  GOBLET_REPORTS_DIR,
  GOBLET_SUPPORT_DIR,
  GOBLET_FEATURES_DIR,
  GOBLET_WAYPOINT_DIR,
  GOBLET_ARTIFACTS_DIR,
  GOBLET_ENVIRONMENTS_DIR,
})


/**
 * Constants that should only be imported in a node runtime environment, the backend
 */
module.exports = deepFreeze({
  SUB_REPOS: repoPaths,
  GOBLET_PW_METADATA_DIR,
  GOBLET_ROOT: GobletRoot,
  GOBLET_WORLD_FILE,
  ...dirsFromEnvs,
})

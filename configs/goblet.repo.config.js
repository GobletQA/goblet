const {
  GOBLET_ROOT,
  GOBLET_UNIT_DIR,
  GOBLET_WORLD_FILE,
  GOBLET_WORK_DIR,
  GOBLET_STEPS_DIR,
  GOBLET_REPORTS_DIR,
  GOBLET_SUPPORT_DIR,
  GOBLET_FEATURES_DIR,
  GOBLET_WAYPOINT_DIR,
  GOBLET_ARTIFACTS_DIR,
  GOBLET_ENVIRONMENTS_DIR,
} = require('./paths.config')

module.exports = {
  /**
   * Options for browser recorder
   * @type {Object}
   */
  recorder: {
    locator: `-- 🍷 GOBLET`,
  },

  /**
   * Paths to a repos goblet specific files
   * @type {Object}
   */
  paths: {
    /**
     * Path to the connected repo's root directory
     * i.e. /goblet/repos/<git-user-name>/current
     * @type {string} - Absolute Path
     */
    // TODO IMPORTANT - This is pointing to the goblet root directory, needs fixed
    repoRoot: GOBLET_ROOT,

    /**
     * Path to the goblet folder, **Relative to the repoRoot**
     * @type {string} - Relative Path
     */
    workDir: GOBLET_WORK_DIR,

  /**
   * **The below paths are all relative to "<repoRoot>/<workDir>/"**
   * repoRoot - Absolute path to the repo
   * workDir - Relative path to the goblet folder of the repo
   * All other paths - "<repoRoot>/<workDir>/<type>"
   */

    /**
     * Path to the test reports folder
     * Where reports for test runs are saved
     * Relative to the "<repoRoot>/<workDir>/"
     * @type {string} - Relative Path
     * @example - "/artifacts/reports"
     */
    reportsDir: GOBLET_REPORTS_DIR,

    /**
     * Path to the test artifacts folder
     * Stores downloaded files, and video recordings of browser interactions
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/artifacts"
     */
    artifactsDir: GOBLET_ARTIFACTS_DIR,

    /**
     * Path to the environment folder
     * Holds configuration for different environments
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/environments"
     */
    environmentsDir: GOBLET_ENVIRONMENTS_DIR,

    /**
     * Path to the Gherkin feature folder
     * Contains feature files using Gherkin syntax (Parkin Variation)
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/bdd/features"
     */
    featuresDir: GOBLET_FEATURES_DIR,
    
    /**
     * Path to the feature step definitions
     * Contains custom step definitions matching feature file steps
     * Joined with the default Goblet Step Definitions
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/bdd/steps"
     */
    stepsDir: GOBLET_STEPS_DIR,

    /**
     * Path to the Parkin / Features / Steps support files
     * Extra files for configuring / supporting Parkin parsing and test execution
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/bdd/support"
     */
    supportDir: GOBLET_SUPPORT_DIR,

    /**
     * Path to the Jest unit tests directory containing unit test files
     * Test File names should match one of the following patterns
     *  `unit.*.js || *.unit.js || un.*.js || *.un.js || test.*.js || *.test.js`
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/unit"
     */
    unitDir: GOBLET_UNIT_DIR,

    /**
     * Path to the Jest unit tests directory containing unit test files
     * Test File names should match one of the following patterns
     *  `waypoint.*.js || *.waypoint.js || wp.*.js || *.wp.js || test.*.js || *.test.js`
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/waypoint"
     */
    waypointDir: GOBLET_WAYPOINT_DIR,

    /**
     * Path to the world file
     * Should include the file extension
     * Relative to the `<repoRoot>/<workDir>/`
     * @type {string} - Relative Path
     * @example - "/world.js"
     */
    world: GOBLET_WORLD_FILE
  },
}

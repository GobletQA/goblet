const path = require('path')
const { testUtilsDir } = require('../paths')
const { deepFreeze } = require('@keg-hub/jsutils')

const constants = deepFreeze({
  browsers: {
    all: `--all-browsers`,
    chrome: `--chromium`,
    firefox: `--firefox`,
    safari: `--webkit`,
    webkit: `--webkit`,
  },
  browserNames: ['chromium', 'firefox', 'webkit'],
  jestConfigMap: {
    unit: path.join(testUtilsDir, `src/jest/jest.unit.config.js`),
    feature: path.join(testUtilsDir, `src/jest/jest.parkin.config.js`),
    waypoint: path.join(testUtilsDir, `src/jest/jest.waypoint.config.js`),
  },
  testTypes: {
    unit: `unit`,
    bdd: `bdd`,
    feature: `feature`,
    waypoint: `waypoint`,
  },
  envFilter: {
    starts: [
      `npm_`,
      `HOME`,
      `KEG_`,
      `FIREBASE`,
      `FIRE_BASE`,
      `GOOGLE`,
      `AZURE`,
      `AWS`
      // `DOC`,
      // `COMPOSE`,
      // `GIT`,
    ],
    // Need better way to handle this relative to secrets
    // Otherwise can't pass secrets via ENV when running in CI
    contains: [
      // `PWD`,
      // `KEY`,
      // `AUTH`,
      // `COOKIE`,
      // `PASS`
    ],
    ends: [
      `_PATH`,
      `_PORT`,
    ],
    exclude: [
      `PLAYWRIGHT_BROWSERS_PATH`
    ],
    add: [
      `GOBLET_ARTIFACTS_DEBUG`,
    ]
  }
})

module.exports = constants

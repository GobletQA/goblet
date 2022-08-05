const path = require('path')
const { testUtilsDir } = require('../paths')
const { deepFreeze } = require('@keg-hub/jsutils')

/**
 * Contexts to reference durning task execution
 */
const initialContexts = [
  [`app`],
  [`base`, `bse`, `bs`],
  [`proxy`, `prx`, `px`],
  [`frontend`, `fre` `fe`],
  [`backend`, `bae`, `be`],
  [`conductor`, `cod`, `cd`],
  [`screencast`, `scr`, `sc`],
]

const constants = deepFreeze({
  allContexts: initialContexts.reduce((acc, keys) => {
    const long = keys[0]
    const short = keys[keys.length - 1]
    // Both short and log ref the same object
    acc[short] = { keys, short, long }
    acc[long] = acc[short]

    return acc
  }, {}),
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
      `DOC`,
      `COMPOSE`,
      `HOME`,
      `KEG_`,
      `FIRE`,
      `GIT`,
      `GOOGLE`,
      `AZURE`,
      `AWS`
    ],
    contains: [
      `PWD`,
      `KEY`,
      `AUTH`,
      `COOKIE`,
      `PASS`
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

const path = require('path')
const { testUtilsDir } = require('../paths')
const { deepFreeze } = require('@keg-hub/jsutils')

const beContextAlias = [`backend`, `be`]
const feContextAlias = [`frontend`, `fe`]
const proxyContextAlias = [`proxy`, `px`]
const dbContextAlias = [`database`, `db`]
const scContextAlias = [`screencast`, `sc`]
const cdContextAlias = [`conductor`, `cd`]

const appContextAlias = [
  `app`,
  ...proxyContextAlias,
  ...beContextAlias,
  ...feContextAlias,
  ...scContextAlias,
  ...cdContextAlias
]
const allContextAlias = [`all`, ...dbContextAlias, ...appContextAlias]

const rootTasks = [`format`]
const repoTasks = [...rootTasks, `validate`, `test`]
const mergeTasks = [...repoTasks, `build`]
const publishTasks = [`task`, `publish`]
const publishTagTasks = [...publishTasks, '--tag']

const forceExitEvents = ['SIGINT', `SIGHUP`, 'SIGTERM']

const shortContextMap = {
  app: `app`,
  proxy: `px`,
  backend: 'be',
  database: `db`,
  frontend: `fe`,
  conductor: `cd`,
  screencast: `sc`,
}


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
  },
  rootTasks,
  repoTasks,
  mergeTasks,
  publishTasks,
  publishTagTasks,
  shortContextMap,
  forceExitEvents,
  allContextAlias,
  appContextAlias,
  dbContextAlias,
  beContextAlias,
  feContextAlias,
  proxyContextAlias,
})

module.exports = constants

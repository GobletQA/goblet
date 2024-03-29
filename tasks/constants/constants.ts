
import path from 'path'
import { testifyDir } from '../paths'
import { ETestType } from '@gobletqa/shared/enums'
import { deepFreeze, keyMap } from '@keg-hub/jsutils'
import { FullBrowserNames } from '@gobletqa/browser'

export type TTaskConstants = {
  PWDebug: typeof PWDebug
  browsers: typeof Browsers
  testTypes: typeof TestTypes
  envFilter: typeof EnvFilter
  browserNames: typeof FullBrowserNames
  testConfigMap: typeof TestConfigMap
}

export type TEnvFilter = {
  add:string[]
  ends:string[]
  starts:string[]
  contains:string[]
  exclude:string[]
}

export const Browsers = {
  all: `--all-browsers`,
  chrome: `--chromium`,
  firefox: `--firefox`,
  safari: `--webkit`,
  webkit: `--webkit`,
}

const cfgOpts = process.env.GOBLET_TESTS_ACTION
  ? {dir:`dist`, ext:`js`}
  : {dir:`src`, ext: `ts`}

export const TestConfigMap = {
  [ETestType.feature]: path.join(testifyDir, `${cfgOpts.dir}/exam/exam.feature.config.${cfgOpts.ext}`),
  [ETestType.unit]: path.join(testifyDir, `${cfgOpts.dir}/exam/exam.unit.config.${cfgOpts.ext}`),
  [ETestType.waypoint]: path.join(testifyDir, `${cfgOpts.dir}/exam/exam.waypoint.config.${cfgOpts.ext}`),
}

export const TestTypes = {
  bdd: ETestType.bdd,
  unit: ETestType.unit,
  feature: ETestType.feature,
  waypoint: ETestType.waypoint,
}

export const EnvFilter:TEnvFilter = {
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

// Used to set DEBUG env when running playwright browser
export const PWDebug = {
  options: keyMap([
    `api`,
    `browser`,
    `channel`,
    `error`,
    `protocol`,
    `install`,
    `download`,
    `proxy`,
  ]),
  // Channel sub-options
  channel: keyMap([
    `command`,
    `response`,
    `event`,
  ]),
}

export const DockerBuildxBuilder = `goblet`

export const constants = deepFreeze<TTaskConstants>({
  PWDebug,
  browsers: Browsers,
  testTypes: TestTypes,
  envFilter: EnvFilter,
  testConfigMap: TestConfigMap,
  browserNames: FullBrowserNames,
})

export {
  constants as default
}

import { TTestRunUICfg, TRepoOpts, TSetting, TSettings } from '@types'
import { getStore } from '@store'
import {
  exists,
  isNum,
  toNum,
  isBool,
  toBool,
  deepMerge,
} from '@keg-hub/jsutils'

/**
 
 * This is used to fix a bug, really the type should already be correct
 * Need to investigate why it's not set
 */
const ensureType = (setting:TSetting) => {
  if(!setting || !setting.active || !exists(setting.value)) return undefined
  if(!setting?.type) return setting?.value
  
  return setting.type === `number` && setting?.postfix !== `px`
    ? isNum(setting.value)
      ? setting.value
      : toNum(setting.value)
    : setting.type === `boolean` && !isBool(setting.value)
      ? toBool(setting.value)
      : setting.value
}


const addSettingOpt = (
  opts:Partial<TTestRunUICfg>,
  key:keyof TTestRunUICfg,
  setting:TSetting
) => {
  const value = setting?.active ? ensureType(setting) : undefined
  value && (opts[key] = value)
}

export type TBuildTestRunCfg = {
  repo?:TRepoOpts
  settings?:TSettings
}

const getStoreItems = (opts:TBuildTestRunCfg) => {
  const state = getStore()?.getState()
  return {
    repo: opts.repo ?? state.repo,
    settings: opts.settings ?? state.settings
  }
}

/**
 * Loads the world and store settings and merges them together
 * Then sets default test run specific params based on the merged settings
 */
export const buildTestRunCfg = (opts:TBuildTestRunCfg) => {
  const testRunCfg:Partial<TTestRunUICfg> = {}
  const { repo, settings } = getStoreItems(opts)
  const mergedSettings = deepMerge(settings, repo?.world?.settings)

  // ------ Browser Specific Options ---- //
  // TODO: update browser.timeout to be `browser.browserTimeout`
  addSettingOpt(testRunCfg, `browserTimeout`, mergedSettings?.browser?.timeout)
  addSettingOpt(testRunCfg, `browserTimeout`, mergedSettings?.browser?.browserTimeout)

  addSettingOpt(testRunCfg, `debug`, mergedSettings?.browser?.debug)
  addSettingOpt(testRunCfg, `slowMo`, mergedSettings?.browser?.slowMo)
  addSettingOpt(testRunCfg, `browser`, mergedSettings?.browser?.browser)
  addSettingOpt(testRunCfg, `devices`, mergedSettings?.browser?.devices)
  addSettingOpt(testRunCfg, `timezone`, mergedSettings?.browser?.timezone)
  addSettingOpt(testRunCfg, `geolocation`, mergedSettings?.browser?.geolocation)
  addSettingOpt(testRunCfg, `permissions`, mergedSettings?.browser?.permissions)

  addSettingOpt(testRunCfg, `width`, mergedSettings?.browser?.width)
  addSettingOpt(testRunCfg, `height`, mergedSettings?.browser?.height)
  addSettingOpt(testRunCfg, `isMobile`, mergedSettings?.browser?.isMobile)
  addSettingOpt(testRunCfg, `hasTouch`, mergedSettings?.browser?.hasTouch)
  addSettingOpt(testRunCfg, `downloads`, mergedSettings?.browser?.downloads)
  
  addSettingOpt(testRunCfg, `reusePage`, mergedSettings?.browser?.reusePage)
  addSettingOpt(testRunCfg, `reuseContext`, mergedSettings?.browser?.reuseContext)


  // ------ Test Specific Options ---- //
  addSettingOpt(testRunCfg, `tags`, mergedSettings?.test?.tags)
  addSettingOpt(testRunCfg, `video`, mergedSettings?.test?.video)
  addSettingOpt(testRunCfg, `filter`, mergedSettings?.test?.filter)
  addSettingOpt(testRunCfg, `tracing`, mergedSettings?.test?.tracing)
  addSettingOpt(testRunCfg, `headless`, mergedSettings?.test?.headless)
  addSettingOpt(testRunCfg, `screenshot`, mergedSettings?.test?.screenshot)
  addSettingOpt(testRunCfg, `testReport`, mergedSettings?.test?.testReport)

  addSettingOpt(testRunCfg, `testBail`, mergedSettings?.test?.testBail)
  addSettingOpt(testRunCfg, `testTimeout`, mergedSettings?.test?.testTimeout)
  addSettingOpt(testRunCfg, `suiteTimeout`, mergedSettings?.test?.suiteTimeout)

  addSettingOpt(testRunCfg, `testRetry`, mergedSettings?.test?.testRetry)
  addSettingOpt(testRunCfg, `testDebug`, mergedSettings?.test?.testDebug)
  addSettingOpt(testRunCfg, `suiteRetry`, mergedSettings?.test?.suiteRetry)
  addSettingOpt(testRunCfg, `testVerbose`, mergedSettings?.test?.testVerbose)

  addSettingOpt(testRunCfg, `exitOnFailed`, mergedSettings?.test?.exitOnFailed)
  addSettingOpt(testRunCfg, `skipAfterFailed`, mergedSettings?.test?.skipAfterFailed)

  return testRunCfg
}
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
  const examCfg:Partial<TTestRunUICfg> = {}
  const { repo, settings } = getStoreItems(opts)
  const mergedSettings = deepMerge(settings, repo?.world?.settings)

  // ------ Browser Specific Options ---- //
  // TODO: update browser.timeout to be `browser.browserTimeout`
  addSettingOpt(examCfg, `browserTimeout`, mergedSettings?.browser?.timeout)
  addSettingOpt(examCfg, `browserTimeout`, mergedSettings?.browser?.browserTimeout)

  addSettingOpt(examCfg, `debug`, mergedSettings?.browser?.debug)
  addSettingOpt(examCfg, `slowMo`, mergedSettings?.browser?.slowMo)
  addSettingOpt(examCfg, `browser`, mergedSettings?.browser?.browser)
  addSettingOpt(examCfg, `devices`, mergedSettings?.browser?.devices)
  addSettingOpt(examCfg, `timezone`, mergedSettings?.browser?.timezone)
  addSettingOpt(examCfg, `geolocation`, mergedSettings?.browser?.geolocation)
  addSettingOpt(examCfg, `permissions`, mergedSettings?.browser?.permissions)

  addSettingOpt(examCfg, `width`, mergedSettings?.browser?.width)
  addSettingOpt(examCfg, `height`, mergedSettings?.browser?.height)
  addSettingOpt(examCfg, `isMobile`, mergedSettings?.browser?.isMobile)
  addSettingOpt(examCfg, `hasTouch`, mergedSettings?.browser?.hasTouch)
  addSettingOpt(examCfg, `downloads`, mergedSettings?.browser?.downloads)
  
  addSettingOpt(examCfg, `reusePage`, mergedSettings?.browser?.reusePage)
  addSettingOpt(examCfg, `reuseContext`, mergedSettings?.browser?.reuseContext)


  // ------ Test Specific Options ---- //
  addSettingOpt(examCfg, `tags`, mergedSettings?.test?.tags)
  addSettingOpt(examCfg, `video`, mergedSettings?.test?.video)
  addSettingOpt(examCfg, `filter`, mergedSettings?.test?.filter)
  addSettingOpt(examCfg, `tracing`, mergedSettings?.test?.tracing)
  addSettingOpt(examCfg, `headless`, mergedSettings?.test?.headless)
  addSettingOpt(examCfg, `screenshot`, mergedSettings?.test?.screenshot)
  addSettingOpt(examCfg, `testReport`, mergedSettings?.test?.testReport)

  addSettingOpt(examCfg, `testBail`, mergedSettings?.test?.testBail)
  addSettingOpt(examCfg, `testTimeout`, mergedSettings?.test?.testTimeout)
  addSettingOpt(examCfg, `suiteTimeout`, mergedSettings?.test?.suiteTimeout)

  addSettingOpt(examCfg, `testRetry`, mergedSettings?.test?.testRetry)
  addSettingOpt(examCfg, `testDebug`, mergedSettings?.test?.testDebug)
  addSettingOpt(examCfg, `suiteRetry`, mergedSettings?.test?.suiteRetry)
  addSettingOpt(examCfg, `testVerbose`, mergedSettings?.test?.testVerbose)

  addSettingOpt(examCfg, `exitOnFailed`, mergedSettings?.test?.exitOnFailed)
  addSettingOpt(examCfg, `skipAfterFailed`, mergedSettings?.test?.skipAfterFailed)

  return examCfg
}
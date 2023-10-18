import type { TExamCliOpts } from "@GEX/types/bin.types"
import type { EExTestMode, TExamConfig } from '@GEX/types/exam.types'

import { fullLoc } from './helpers'
import { LoaderErr } from "@GEX/utils/error"
import { toNum } from '@keg-hub/jsutils/toNum'
import { isObj } from '@keg-hub/jsutils/isObj'
import { isNum } from '@keg-hub/jsutils/isNum'
import { isBool } from '@keg-hub/jsutils/isBool'
import { isFunc } from '@keg-hub/jsutils/isFunc'
import { toBool } from '@keg-hub/jsutils/toBool'
import { ExamCfgModeTypes } from "@GEX/constants"
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { flatUnion } from '@keg-hub/jsutils/flatUnion'
import { buildExamCfg } from "@GEX/utils/buildExamCfg"
import {mergeCfgArrays} from "@GEX/utils/mergeCfgArrays"

const getCfgObj = async (opts:TExamCliOpts) => {
  const configLog = fullLoc(opts.config, opts.rootDir)
  try {
    const mod = require(configLog)
    const found = isFunc(mod)
      ? await mod(opts)
      : isObj(mod.default)
        ? mod.default
        : isFunc(mod.default)
          ? await mod.default(opts)
          : mod

    return found || {}
  }
  catch(err){
    throw new LoaderErr(
      `Error loading Exam config at location; ${configLog}`,
      err,
      true
    )
  }
}

const getRunMode = (base:Partial<TExamCliOpts>, override:Partial<TExamCliOpts>) => {
  const ov = (ExamCfgModeTypes.includes(override.mode) && override.mode)
    || (override.serial && `serial`)
    || (override.parallel && `parallel`)

  const final = ov
    || (ExamCfgModeTypes.includes(base.mode) && base.mode)
    || base.serial && `serial`
    || base.parallel && `parallel`

  return (ExamCfgModeTypes.includes(final) ? final : `serial`) as EExTestMode
}

const mergeConfig = (base:Partial<TExamCliOpts>, override:Partial<TExamCliOpts>):TExamConfig => {

  /**
   * --- These options come from the exam config, and should be overridden by passed in cli options ---
   */
  const {

    // --- Don't include in the cli config --- //
    onEvent:bOnEvent,
    onCancel:bOnCancel,
    onCleanup:bOnCleanup,
    // --- Don't include in the cli config --- //


    // --- Don't destructure to they are set in the final object --- //
    // config:bConfig,
    // esbuild: bEsbuild,
    // envs:bEnvs,
    // aliases: bAliases,
    // globals: bGlobals,
    // runners: bRunners,
    // transforms: bTransforms,
    // environment: bEnvironment,
    // --- Don't destructure to they are set in the final object --- //


    // --- Pull these out , so they are not included via destructuring --- //
    mode:bMode,
    serial:bSerial,
    parallel:bParallel,
    reporters:bReporters,
    testMatch: bTestMatch,
    preRunner: bPreRunner,
    postRunner: bPostRunner,
    testIgnore: bTestIgnore,
    loaderIgnore: bLoaderIgnore,
    transformIgnore: bTransformIgnore,
    preEnvironment: bPreEnvironment,
    postEnvironment: bPostEnvironment,
    // --- Pull these out , so they are not included via destructuring --- //


    bail: bBail,
    colors: bColors,
    silent: bSilent,
    workers: bWorkers,
    testRetry: bTestRetry,
    runInBand: bRunInBand,
    suiteRetry: bSuiteRetry,
    concurrency: bConcurrency,
    reuseRunner: bReuseRunner,
    exitOnFailed: bExitOnFailed,
    skipAfterFailed: bSkipAfterFailed,

    rootDir: bRootDir,
    testDir: bTestDir,

    debug:bDebug,
    verbose: bVerbose,
    extensions: bExtensions,
    testTimeout: bTestTimeout,
    suiteTimeout: bSuiteTimeout,
    
    
    ...baseRest
  } = base

  /**
   * --- These options come from the CLI, and should override any default config options ---
   */
  const {

    // --- Don't include in the cli config --- //
    onEvent,
    onCancel,
    onCleanup,
    // --- Don't include in the cli config --- //

    // --- These do not work from the CLI --- //
    envs,
    config,
    aliases,
    esbuild,
    globals,
    runners,
    transforms,
    environment,
    // --- These do not work from the CLI --- //
    
    
    // --- Pull these out , so they are not included via destructuring --- //
    mode,
    serial,
    parallel,
    reporters,
    testMatch,

    preRunner,
    postRunner,

    testIgnore,
    loaderIgnore,
    transformIgnore,

    preEnvironment,
    postEnvironment,
    // --- Pull these out , so they are not included via destructuring --- //


    bail,
    colors,
    silent,
    workers,
    testRetry,
    runInBand,
    suiteRetry,
    concurrency,
    reuseRunner,
    exitOnFailed,
    skipAfterFailed,

    rootDir,
    testDir,

    debug,
    verbose,
    extensions,
    testTimeout,
    suiteTimeout,

  } = override

  const rIB = toBool(runInBand ?? bRunInBand)

  /**
   * --- Final config used for executing the tests ---
   */
  const examCfg = {
    ...baseRest,
    runInBand:rIB,
    rootDir: rootDir ?? bRootDir,
    testDir: testDir ?? bTestDir,
    debug: toBool(debug ?? bDebug),
    mode: getRunMode(base, override),
    colors: toBool(colors ?? bColors),

    silent: toBool(silent ?? bSilent),
    workers: toNum(workers ?? bWorkers),
    verbose: toBool(verbose ?? bVerbose),
    testRetry: toNum(testRetry ?? bTestRetry),
    suiteRetry: toNum(suiteRetry ?? bSuiteRetry),
    testTimeout: toNum(testTimeout ?? bTestTimeout),
    concurrency: toNum(concurrency ?? bConcurrency),
    reuseRunner: toBool(reuseRunner ?? bReuseRunner),
    suiteTimeout: toNum(suiteTimeout ?? bSuiteTimeout),
    exitOnFailed: toBool(exitOnFailed ?? bExitOnFailed),
    bail: isBool(bail) ? bail : isNum(bail) ? bail : bBail,
    skipAfterFailed: toBool(skipAfterFailed ?? bSkipAfterFailed),
    extensions: flatUnion([...(bExtensions||emptyArr), ...(extensions||emptyArr)]),
    ...mergeCfgArrays(base, override),
  } as TExamConfig

  return examCfg
}

const buildNoConfig = (opts:TExamCliOpts):TExamConfig => {
  const {
    mode,
    config,
    serial,
    onEvent,
    parallel,
    onCancel,
    onCleanup,
    ...rest
  } = opts

  return {...rest, mode: getRunMode(opts, opts)}
}

/**
 * Merges the cli config options, loaded exam.config options, and the default options
 * Fist merges the cli and loaded exam.config options, then merges that with the default options
 * Priority follows the same order. The cli options override the exam.config options
 * Which overrides teh exam default options
 */
export const getConfig = async (opts:TExamCliOpts):Promise<TExamConfig> => {
  const built:TExamConfig = !opts.config
    ? buildNoConfig(opts)
    : mergeConfig(await getCfgObj(opts), opts)

  // Merge the merged cli and exam.config options with the default config options
  return buildExamCfg(built)
}
import type { TExamCliOpts } from "@GEX/types/bin.types"
import type { EExTestMode, TExamConfig } from '@GEX/types/exam.types'

import { fullLoc } from './helpers'
import { ExamCfgModeTypes } from "@GEX/constants"
import { buildExamCfg } from "@GEX/utils/buildExamCfg"
import {mergeCfgArrays} from "@GEX/utils/mergeCfgArrays"
import {
  toNum,
  isObj,
  isFunc,
  toBool,
  isNum,
  isBool,
  flatUnion,
} from '@keg-hub/jsutils'


const getCfgObj = async (opts:TExamCliOpts) => {
  const mod = require(fullLoc(opts.config, opts.rootDir))
  const found = isFunc(mod)
    ? await mod(opts)
    : isObj(mod.default)
      ? mod.default
      : isFunc(mod.default)
        ? await mod.default(opts)
        : mod

  return found || {}
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

const atLeastOne = (base:number, override:number, runInBand?:boolean) => {
  if(runInBand) return 1

  const num = toNum(override ?? base)
  return num || 1
}


const mergeConfig = (base:Partial<TExamCliOpts>, override:Partial<TExamCliOpts>):TExamConfig => {
  const {

    // --- Don't include in the cli config --- //
    events: bEvents,
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
    // reporters: bReporters,
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

    rootDir: bRootDir,
    testDir: bTestDir,

    debug:bDebug,
    verbose: bVerbose,
    timeout: bTimeout,
    extensions: bExtensions,
    globalTimeout: bGlobalTimeout,
    
    
    ...baseRest
  } = base

  const {

    // --- Don't include in the cli config --- //
    events,
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

    rootDir,
    testDir,

    debug,
    verbose,
    timeout,
    extensions,
    globalTimeout,

  } = override

  const rIB = toBool(runInBand ?? bRunInBand)

  const examCfg = {
    ...baseRest,
    runInBand:rIB,
    rootDir: rootDir ?? bRootDir,
    testDir: testDir ?? bTestDir,
    debug: toBool(debug ?? bDebug),
    mode: getRunMode(base, override),
    colors: toBool(colors ?? bColors),
    silent: toBool(silent ?? bSilent),
    timeout: toNum(timeout ?? bTimeout),
    workers: toNum(workers ?? bWorkers),
    verbose: toBool(verbose ?? bVerbose),
    testRetry: toNum(testRetry ?? bTestRetry),
    suiteRetry: toNum(suiteRetry ?? bSuiteRetry),
    concurrency: toNum(concurrency ?? bConcurrency),
    globalTimeout: toNum(globalTimeout ?? bGlobalTimeout),
    bail: isBool(bail) ? bail : isNum(bail) ? bail : bBail,
    extensions: flatUnion([...bExtensions, ...extensions]),
    ...mergeCfgArrays(base, override),
  } as TExamConfig

  return examCfg
}

const buildNoConfig = (opts:TExamCliOpts):TExamConfig => {
  const {
    mode,
    events,
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

export const getConfig = async (opts:TExamCliOpts) => {
  const built = !opts.config
    ? buildNoConfig(opts)
    : mergeConfig(await getCfgObj(opts), opts)

  return buildExamCfg(built)
}
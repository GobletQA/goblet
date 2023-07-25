import type { TExamCliOpts } from "../types/bin.types"
import type { EExTestMode, TExamConfig } from '../types/exam.types'

import { fullLoc } from './helpers'
import { ensureArr, flatUnion, isFunc, isObj, toBool, toNum } from '@keg-hub/jsutils'

const modeTypes = [
  `serial`,
  `parallel`
]

const getCfgObj = (opts:TExamCliOpts) => {
  const mod = require(fullLoc(opts.config, opts.rootDir))
  const found = isFunc(mod)
    ? mod()
    : isObj(mod.default)
      ? mod.default
      : isFunc(mod.default)
        ? mod.default()
        : mod

  return found || {}
}

const getRunMode = (base:Partial<TExamCliOpts>, override:Partial<TExamCliOpts>) => {
  const ov = (modeTypes.includes(override.mode) && override.mode)
    || (override.serial && `serial`)
    || (override.parallel && `parallel`)

  const final = ov
    || (modeTypes.includes(base.mode) && base.mode)
    || base.serial && `serial`
    || base.parallel && `parallel`

  return (modeTypes.includes(final) ? final : `serial`) as EExTestMode
}

const mergeConfig = (base:Partial<TExamCliOpts>, override:Partial<TExamCliOpts>):TExamConfig => {
  const {
    config:bConfig,
    // --- Don't destructure to they are set in the final object --- //
    // esbuild: bEsbuild,
    // envs:bEnvs,
    // aliases: bAliases,
    // globals: bGlobals,
    // events: bEvents,
    // runners: bRunners,
    // reporters: bReporters,
    // transforms: bTransforms,
    // environment: bEnvironment,
    // environments: bEnvironments,
    // --- Don't detructure to they are set in the final object --- //
    
    mode:bMode,

    bail: bBail,
    colors: bColors,
    silent: bSilent,
    workers: bWorkers,
    testRetry: bTestRetry,
    runInBand: bRunInBand,
    suiteRetry: bSuiteRetry,
    concurrency: bConcurrency,

    serial:bSerial,
    parallel:bParallel,

    debug:bDebug,
    verbose: bVerbose,
    timeout: bTimeout,
    globalTimeout: bGlobalTimeout,
    extensions: bExtensions,
    
    rootDir: bRootDir,
    testDir: bTestDir,
    testMatch: bTestMatch,
    
    preRunner: bPreRunner,
    postRunner: bPostRunner,
   
    testIgnore: bTestIgnore,
    loaderIgnore: bLoaderIgnore,
    transformIgnore: bTransformIgnore,

    preEnvironment: bPreEnvironment,
    postEnvironment: bPostEnvironment,
    ...baseRest
  } = base

  const {
    // --- These do not work from the CLI --- //
    envs,
    config,
    aliases,
    esbuild,
    events,
    globals,
    runners,
    reporters,
    transforms,
    environment,
    environments,
    // --- These do not work from the CLI --- //

    mode,

    bail,
    colors,
    silent,
    workers,
    testRetry,
    runInBand,
    suiteRetry,
    concurrency,

    serial,
    parallel,

    debug,
    verbose,
    timeout,
    globalTimeout,
    extensions,

    rootDir,
    testDir,
    testMatch,

    preRunner,
    postRunner,

    testIgnore,
    loaderIgnore,
    transformIgnore,

    preEnvironment,
    postEnvironment,

  } = override

  return {
    ...baseRest,
    mode: getRunMode(base, override),

    bail: toNum(bail ?? bBail),
    colors: toBool(colors ?? bColors),
    silent: toBool(silent ?? bSilent),
    workers: toNum(workers ?? bWorkers),
    testRetry: toNum(testRetry ?? bTestRetry),
    runInBand: toBool(runInBand ?? bRunInBand),
    suiteRetry: toNum(suiteRetry ?? bSuiteRetry),
    concurrency: toNum(concurrency ?? bConcurrency),

    debug: toBool(debug ?? bDebug),
    timeout: toNum(timeout ?? bTimeout),
    verbose: toBool(verbose ?? bVerbose),
    globalTimeout: toNum(globalTimeout ?? bGlobalTimeout),
    extensions: flatUnion(ensureArr(bExtensions), ensureArr(extensions)),

    rootDir: rootDir ?? bRootDir,
    testDir: testDir ?? bTestDir,
    testMatch: flatUnion(ensureArr(bTestMatch), ensureArr(testMatch)),

    preRunner: flatUnion(ensureArr(bPreRunner), ensureArr(preRunner)),
    postRunner: flatUnion(ensureArr(bPostRunner), ensureArr(postRunner)),

    testIgnore: flatUnion(ensureArr(bTestIgnore), ensureArr(testIgnore)),
    loaderIgnore: flatUnion(ensureArr(bLoaderIgnore), ensureArr(loaderIgnore)),
    transformIgnore: flatUnion(ensureArr(bTransformIgnore), ensureArr(transformIgnore)),

    preEnvironment: flatUnion(ensureArr(bPreEnvironment), ensureArr(preEnvironment)),
    postEnvironment: flatUnion(ensureArr(bPostEnvironment), ensureArr(postEnvironment)),

  } as TExamConfig
}

const buildNoConfig = (opts:TExamCliOpts):TExamConfig => {
  const {
    config,
    mode,
    serial,
    parallel,
    ...rest
  } = opts
  
  return {...rest, mode: getRunMode(opts, opts)}
}

export const getConfig = (opts:TExamCliOpts) => {
  return !opts.config
    ? buildNoConfig(opts)
    : mergeConfig(getCfgObj(opts), opts)
}
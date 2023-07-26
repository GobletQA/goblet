import type {
  TExamConfig,
  TExArrOptsMap,
  TExamBuilTCfg,
} from '@GEX/types'

import {emptyArr, isArr, isStr} from '@keg-hub/jsutils'
import { buildReporters } from './buildReporters'
import { ExamCfg, RootDirKey } from '@GEX/constants'

const resolveRootDir = (config:TExamConfig) => {
  return config.rootDir
    || process?.env?.EXAM_ROOT_DIR
    || process?.env?.GOBLET_MOUNT_ROOT
    || process?.env?.GOBLET_CONFIG_BASE
    || ExamCfg.rootDir
}

const replaceRootObj = <T=Record<string, string>>(obj:T, rootDir:string) => {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const replaced = isStr(val)
      ? val.replaceAll(RootDirKey, rootDir)
      : isArr(val)
        ? val.map(item => isStr(item) ? item.replaceAll(RootDirKey, rootDir) : item)
        : val

    acc[(key.replaceAll(RootDirKey, rootDir)) as keyof T] = replaced as any
    return acc
  }, {} as T)
}

const replaceRootArr = <T extends any[]=string[]>(items:T, rootDir:string) => {
  return items?.length
    ? items.map(item => item.replaceAll(RootDirKey, rootDir))
    : emptyArr as T
}

const replaceRootOptsMap = <T extends TExArrOptsMap>(map:T, rootDir:string):T => {
  if(isStr(map))
    return map.replaceAll(RootDirKey, rootDir) as T

  if(isArr(map))
    return map.map((item:any) => isStr(item) ? item.replaceAll(RootDirKey, rootDir) : item) as T

  return map
}

const replaceRootDir = (config:TExamConfig) => {
  
  const {
    rootDir,
    aliases,
    runners,
    reporters,
    transforms,
    testIgnore,
    environment,
    loaderIgnore,
    preEnvironment,
    postEnvironment,
    transformIgnore,
  } = config

  return {
    aliases: replaceRootObj(aliases, rootDir),
    runners: replaceRootObj(runners, rootDir),
    testIgnore: replaceRootArr(testIgnore, rootDir),
    transforms: replaceRootObj(transforms, rootDir),
    reporters: replaceRootOptsMap(reporters, rootDir),
    loaderIgnore: replaceRootArr(loaderIgnore, rootDir),
    environment: replaceRootOptsMap(environment, rootDir),
    preEnvironment: replaceRootArr(preEnvironment, rootDir),
    postEnvironment: replaceRootArr(postEnvironment, rootDir),
    transformIgnore: replaceRootArr(transformIgnore, rootDir),
  } as TExamConfig
  
}

export const buildExamCfg = (config:TExamConfig):TExamConfig => {
  const built = {
    ...ExamCfg,
    ...config,
    rootDir: resolveRootDir(config)
  } as TExamConfig

  return Object.assign(
    built,
    replaceRootDir(built)
  )
}
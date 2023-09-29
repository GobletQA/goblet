import type { TExamConfig, TExArrOptsMap } from '@GEX/types'

import {isArr} from '@keg-hub/jsutils/isArr'
import {isStr} from '@keg-hub/jsutils/isStr'
import {mergeCfgArrays} from './mergeCfgArrays'
import { resolveRootDir } from './resolveRootDir'
import { ExamCfg, RootDirKey } from '@GEX/constants'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'

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
    ? items.map(item => {
        if(isStr(item))
          return item.replaceAll(RootDirKey, rootDir)
        if(isArr(item) && isStr(item[0])){
          const replaced = item[0].replaceAll(RootDirKey, rootDir)
          return [replaced, item[1]]
        }

        return item
    })
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
    ...mergeCfgArrays(ExamCfg, config),
    rootDir: resolveRootDir(config)
  } as TExamConfig

  // TODO: add some validation checks
  // I.E. if running tests in parallel, reuseRunner it forced to false

  return Object.assign<TExamConfig, TExamConfig>(
    built,
    replaceRootDir(built)
  )
}
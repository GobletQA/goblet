import type { TExamConfig } from '@GEX/types'

import {isArr, isStr} from '@keg-hub/jsutils'
import { ExamCfg, RootDirKey } from '@GEX/constants'

const resolveRootDir = (config:TExamConfig) => {
  return config.rootDir
    || process?.env?.EXAM_ROOT_DIR
    || process?.env?.GOBLET_MOUNT_ROOT
    || process?.env?.GOBLET_CONFIG_BASE
    || ExamCfg.rootDir
}

const replaceRootObj = <T=Record<string, string>>(obj:T, rootDir:string) => {
  
  console.log(`------- obj -------`)
  console.log(obj)
  
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const replaced = isStr(val)
      ? val.replaceAll(RootDirKey, rootDir)
      : isArr(val)
        ? val.map(item => isStr(item) ? item.replaceAll(RootDirKey, rootDir) : item)
        : val

    acc[key.replaceAll(RootDirKey, rootDir) as keyof T] = replaced
    return acc
  }, {} as T)
}

const replaceRootArr = <T extends string[]=string[]>(items:T, rootDir:string) => {
  return items.map(item => item.replaceAll(RootDirKey, rootDir))
}

const replaceRootDir = (config:TExamConfig) => {
  
  const {
    rootDir,
    aliases,
    runners,
    transforms,
    testIgnore,
    environments,
    loaderIgnore,
    preEnvironment,
    postEnvironment,
    transformIgnore,
  } = config

    console.log(`------- transforms -------`)
    console.log(transforms)

  return {
    aliases: replaceRootObj(aliases, rootDir),
    runners: replaceRootObj(runners, rootDir),
    // testIgnore: replaceRootArr(testIgnore, rootDir),
    // transforms: replaceRootObj(transforms, rootDir),
    // environments: replaceRootObj(environments, rootDir),
    loaderIgnore: replaceRootArr(loaderIgnore, rootDir),
    preEnvironment: replaceRootArr(preEnvironment, rootDir),
    postEnvironment: replaceRootArr(postEnvironment, rootDir),
    transformIgnore: replaceRootArr(transformIgnore, rootDir),
  }
  
}

export const buildExamCfg = (config:TExamConfig) => {
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
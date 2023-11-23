import type { TCfgFolder } from '../types'

import fs from 'fs'
import path from 'path'
import { findConfig } from './findConfig'
import { Logger } from '@gobletqa/logger'
import { ENVS } from '@gobletqa/environment'

export type TLoadCfgFromBase = {
  base?:string,
  ref?:string,
  remote?:string
  clearCache?:boolean
}

/**
 * Loads a goblet.config from a folder path recursively
 */
export const loadConfigFromBase = (opts:TLoadCfgFromBase) => {
  const {
    clearCache,
    ref=ENVS.GB_REPO_CONFIG_REF,
    base=ENVS.GOBLET_CONFIG_BASE,
    remote=ENVS.GB_GIT_REPO_REMOTE
  } = opts

  if(!base) return null

  const cleanedDir = path.normalize(base)

  if(!fs.existsSync(cleanedDir)) {
    Logger.warn(`Goblet config folder ${cleanedDir} does not exist`)
    return null
  }

  const stat = fs.lstatSync(cleanedDir)
  const startDir = stat.isDirectory() || (ENVS.GOBLET_RUN_FROM_CI && stat.isSymbolicLink())
    ? cleanedDir
    : path.dirname(cleanedDir)

  const cfg:TCfgFolder = ref ? { ref } : { remote }
  if(clearCache) cfg.clearCache = clearCache

  return findConfig(startDir, cfg)

}

import {TTaskParams} from "./cli.types"

import path from 'path'
import { homedir } from 'os'
import { isStr } from '@keg-hub/jsutils/isStr'
import { getGobletConfig, getPathFromConfig } from '@gobletqa/goblet'

/**
 * Resolve the full path to a location similar to path.resolve
 * But can use custom root path values
 */
export const fullLoc = (loc:string, rootDir?:string) => {
  const root = rootDir || process.cwd()
  if(!isStr(loc)) loc = root

  return loc.startsWith(`/`)
    ? loc
    : loc.startsWith(`~/`)
      ? path.join(homedir(), loc.replace(`~/`, ``))
      : path.join(root, loc)
}


/**
 * Finds the folder location that contains the secrets files
 * If the location param is not passed,
 * Attempts to use the repo param to load a goblet config, and use the value as `paths.environmentsDir`
 * Throws an error if the location, goblet config or `path.environmentsDir` can not be found
 * All paths are resolved against the root param or current working directory if it does not exist
 */
export const findSecretsLoc = (params:TTaskParams) => {
  // Expects location to be a path to the secrets directory
  const { location } = params
  const root = findRootLoc(params)

  if(location) return fullLoc(location, root)
  if(!params.repo) throw new Error(`Either the 'repo' or 'location' option if required to run this task`)

  const base = fullLoc(params.repo, root)
  const config = getGobletConfig({ base })
  if(!config) throw new Error(`Goblet config file at repo path '${base}' could not be found`)

  const envsDir = getPathFromConfig(`environmentsDir`, config)
  if(!envsDir) throw new Error(`Environments directory could not be found in goblet config as path '${base}'`)

  return envsDir
}

/**
 * Attempts Finds the folder location of a repository
 * If the location param is not passed,
 * Attempts to use the repo param
 * All paths are resolved against the root param or current working directory if it does not exist 
 * Throws an error if the location, goblet config or `path.environmentsDir` can not be found
 */
export const findRepoLoc = (params:TTaskParams) => {
  // Expects location to be a path to the repository
  const { location, repo } = params
  const root = findRootLoc(params)

  if(location) return fullLoc(location, root)
  if(!repo) throw new Error(`Either the 'repo' or 'location' option if required to run this task`)

  return fullLoc(repo, root)
}

/**
 * Attempts to find the root location to resolve paths from
 * Defaults to the current working directory
 */
export const findRootLoc = (params:TTaskParams) => {
  const { root } = params
  return fullLoc(root)
}

/**
 * Attempts to load a repos $ref from the repos goblet config
 * Throws an error if config can not be found
 */
export const getRefFromPath = (params:TTaskParams) => {
  const base = findRepoLoc(params)
  const config = getGobletConfig({ base })
  if(!config) throw new Error(`Failed to get goblet config at path "${base}"`)

  // @ts-ignore
  return config.$ref as string
}

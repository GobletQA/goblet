import type { TRootPaths, Repo } from '@GSH/types'

import fs from 'fs'
import path from 'path'
import { limboify } from '@keg-hub/jsutils'
import { fileSys } from '@keg-hub/cli-utils'
import { getRepoGobletDir } from '@gobletqa/goblet'

const { getFolderContent } = fileSys

/**
 * Gets the metadata of a path from the local filesystem
 * @param filePath - full path to the folder or file i.e '/goblet/app/tests/bdd/features'
 *
 * @returns - Meta data containing {name, parent, type ( folder || file )} properties
 */
export const isFolder = async (filePath:string) => {
  const [_, stat] = await limboify(fs.stat, filePath)
  return stat.isDirectory()
}

type TGetFilesOpts = {
  filters?: {
    contains?: string[]
    endsWith?: string[]
    startsWith?: string[]
  }
}

/**
 * Transforms the paths string to a specific data object
 * @param paths - full paths to the folder or file i.e '/goblet/app/tests/bdd/features'
 *
 * @returns  - each object has the form:
 *   {id, location, children: {}}
 */
export const getFilesObj = async (
  paths:string[],
  opts?:TGetFilesOpts
) => {
  
  const contains = opts?.filters?.contains || []
  const endsWith = opts?.filters?.endsWith || []
  const startsWith = opts?.filters?.startsWith || []
  
  /**
   * 1. create new object for each 'path' item
   * 2. if the parent path of current 'path' item exists, add it as the child
   */
  return await paths.reduce(async (toResolve, loc) => {
    const acc = await toResolve
    const isDir = await isFolder(loc)
    const final = isDir ? loc.endsWith(`/`) ? loc : `${loc}/` : loc
    
    if(contains.find(it => final.includes(it))) return acc
    if(endsWith.find(it => final.endsWith(it))) return acc
    if(startsWith.find(it => final.startsWith(it))) return acc

    acc[final] = null

    return acc
  }, Promise.resolve({} as TRootPaths))
}

/**
 * Returns an array of root paths
 * @param fullPaths
 * @param repoRoot
 *
 * @returns - filtered paths
 */
export const getRootPaths = (
  fullPaths:string[],
  repoRoot:string
) => {
  return fullPaths.filter(fullPath => path.dirname(fullPath) === repoRoot)
}

export const buildFileTree = async (repo:Repo):Promise<TRootPaths> => {
  const searchOpts = {
    full: true,
    recursive: true,
    exclude: [
      `.DS_Store`,
      `.gitignore`,
      `.gitkeep`,
      `.gobletkeep`,
      `.goblet-keep`,
      `.keep`,
      `node_modules`,
      `.goblet-empty-status.json`,
    ],
  }

  // Get all the paths from the testRoot directory
  const baseDir = getRepoGobletDir(repo)
  const paths = await getFolderContent(baseDir, searchOpts)
  const files = await getFilesObj(paths, {
    filters: {
      // Remove any do-files we might have missed
      startsWith: [`.`]
    }
  })

  return files
}

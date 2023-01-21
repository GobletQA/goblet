import type { Repo } from '../../repo/repo'
import type { TRootPaths } from '../../types'

import fs from 'fs'
import path from 'path'
import { limboify } from '@keg-hub/jsutils'
import { fileSys } from '@keg-hub/cli-utils'
import { getRepoGobletDir } from '@GSH/utils/getRepoGobletDir'

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

/**
 * Transforms the paths string to a specific data object
 * @param paths - full paths to the folder or file i.e '/goblet/app/tests/bdd/features'
 *
 * @returns  - each object has the form:
 *   {id, location, children: {}}
 */
export const getFilesObj = async (
  paths:string[],
) => {
  
  /**
   * 1. create new object for each 'path' item
   * 2. if the parent path of current 'path' item exists, add it as the child
   */
  return await paths.reduce(async (toResolve, loc) => {
    const acc = await toResolve
    const isDir = await isFolder(loc)
    const final = isDir ? loc.endsWith(`/`) ? loc : `${loc}/` : loc

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
    // Exclude specific dot files
    exclude: [
      `.DS_Store`,
      `.gitignore`,
      `.gitkeep`,
      `.keep`,
      `node_modules`,
      `.goblet-empty-status.json`,
    ],
  }

  // Get all the paths from the testRoot directory
  const baseDir = getRepoGobletDir(repo)
  const paths = await getFolderContent(baseDir, searchOpts)
  const files = await getFilesObj(paths)

  return files
}

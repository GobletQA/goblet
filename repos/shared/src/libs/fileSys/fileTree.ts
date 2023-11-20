import type { TRootPaths, Repo } from '@GSH/types'

import path from 'path'
import fs from 'node:fs'
import { readdir } from 'node:fs/promises'
import { limbo } from '@keg-hub/jsutils/limbo'
import { isFunc } from '@keg-hub/jsutils/isFunc'
import { getRepoGobletDir } from '@gobletqa/goblet'
import { limboify } from '@keg-hub/jsutils/limboify'

const defaultFileExclude = [
  `.DS_Store`,
  `.gitignore`,
  `.gitkeep`,
]

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

const throwError = (message) => {
  throw new Error(message)
}

type TBuildFound = {
  file?:string
  allFound:string[]
  fromPath?:string
  opts:TBuildFoundOpts
  recurCall?:(...args:any[]) => any
}

type TBuildFoundOpts = {
  type?:string
  full?:boolean
  exclude?:string[]
  include?:string[]
  recursive?:boolean
}

/**
 * Gets the content of a folder based on passed in options
 * @function
 * @param {string} fromPath - Path to get the content from
 * @param {Array} allFound  - Past found file paths
 * @param {string} file - File path to check if should be added to allFound array
 * @param {boolean} opts.full - Should return the full path
 * @param {string} opts.type - Type of content to return (folder || file)
 * @param {Array} opts.exclude - File or folder to exclude
 * @param {Array} opts.include - File or folder to include
 *
 * @returns {Array} - Array of found file paths
 */
const buildFoundArray = ({
  allFound,
  recurCall,
  file,
  fromPath,
  opts = {} as TBuildFoundOpts,
}:TBuildFound) => {
  const {
    exclude = defaultFileExclude,
    full,
    include = [],
    recursive,
    type
  } = opts

  // Filter out any folder matching the exclude
  if (!file || exclude.indexOf(file) !== -1) return allFound

  // Get the full path of the file or folder
  const fullPath = path.join(fromPath, file)

  // Check if we should use the full path or relative
  const found = full ? fullPath : file

  // Check if its a directory
  const isDir = fs.statSync(fullPath).isDirectory()

  // Check if found should be added to the array based on the passed in arguments
  // Check the for type match or no type
  ;(!type || (type === 'folder' && isDir) || (type !== 'folder' && !isDir)) &&
    (!include.length || include.indexOf(file) !== -1) &&
    allFound.push(found)

  return !isDir || !recursive || !isFunc(recurCall)
    ? allFound
    : recurCall(fullPath, opts, allFound)
}

/**
 * Gets the content of a folder based on passed in options
 * @function
 * @param {string} fromPath - Path to get the content from
 * @param {Object} [opts={}] - Options for filtering the found content
 * @param {boolean} opts.full - Should return the full path
 * @param {string} opts.type - Type of content to return (folder || file)
 * @param {Array} opts.exclude - File or folder to exclude
 * @param {Array} opts.include - File or folder to include
 *
 * @returns {Promise|Array} - Array of found items
 */
const getFolderContent = async (
  fromPath:string,
  opts:TBuildFoundOpts = {} as TBuildFoundOpts,
  foundPaths:string[] = []
) => {
  const [ err, allFiles ] = await limbo(readdir(fromPath))
  err && throwError(err)

  return allFiles.reduce(async (toResolve, file) => {
    const allFound = await toResolve

    return buildFoundArray({
      opts,
      file,
      fromPath,
      allFound,
      recurCall: getFolderContent,
    })
  }, Promise.resolve(foundPaths))
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
  const searchOpts:TBuildFoundOpts = {
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

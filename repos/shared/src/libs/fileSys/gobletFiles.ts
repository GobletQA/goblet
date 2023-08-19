import type { Repo } from '@GSH/types'
import type { TDefGobletConfig, TFileModel } from '../../types'

import os from 'os'
import path from 'path'
import fs from 'fs-extra'
import { Exception } from '@GException'
import { loadReport } from '@GSH/utils/loadReport'
import { loadFeature } from '@GSH/libs/features/features'
import { buildFileModel } from '@GSH/utils/buildFileModel'
import { limbo, limboify, omitKeys } from '@keg-hub/jsutils'
import { resolveFileType } from '@GSH/utils/resolveFileType'
import { exists, get, isBool, isStr } from '@keg-hub/jsutils'
import { getPathFromConfig, getRepoGobletDir } from '@gobletqa/goblet'
import {
  AllowedWorldExtensions,
  DefinitionOverrideFolder
} from '@GSH/constants'

const nPath = os.platform() === `win32` ? path.win32 : path.posix

/**
 * Writes a file to the local HHD
 * @function
 * @param {string} filePath - Path to where the file should be written
 * @param {*} data - Contents to be written to the file
 * @param {string} [format=utf8] - Format of the file
 *
 */
const writeFile = (
  location:string,
  data:string,
  format:string = 'utf8'
) => {
  return limboify<boolean>(fs.writeFile, location, data, format)
}

/**
 * Helper to create a .gobletkeep file when creating an empty directory
 * @function
 * @param {string} location - Folder path to where the file should be created
 *
 */
const ensureGobletKeep = async (location:string) => {
  const emptyTxt = `// Stub - To ensure the folder path is tracked by git\n`
  const stubFile = `.gobletkeep`
  const loc = path.join(location, stubFile)

  const [err, exists] = await limbo(fs.pathExists(loc))

  if(err){
    const error = new Exception({
      err,
      status: 400,
      msg: `Error creating file at : ${loc}`,
    })

    return [error, null]
  }

  return exists
    ? [null, true]
    : await writeFile(loc, emptyTxt) 
}

/**
 * Reads a file from local HHD, and returns the contents
 * @function
 * @param {string} filePath - Path of the file to read
 * @param {string} [format=utf8] - Format of the file
 *
 * @returns {Promise|string} - Content of the file
 */
const readFile = (
  location:string,
  format:string='utf8'
) => {
  return limboify(fs.readFile, location, format)
}


/**
 * Checks that the file path exists
 * @param {String} location - file path to check
 * @throw {Error} if location not found on file system
 */
const checkPathExists = async (location:string, skipThrow?:boolean) => {
  const [err, exists] = await limbo(fs.pathExists(location))

  if ((err || !exists) && !skipThrow)
    throw new Exception({
      err,
      status: 400,
      msg: `Path not found: ${location}`,
    })

  return exists ? true : false
}

const inRepoRoot = (
  repo:Repo,
  location:string,
  skipThrow?:boolean
) => {
  // Check that the file being remove is in the mounted repo folder
  // This ensure no other files can be removed
  const { repoRoot } = repo.paths
  const isTestRoot = location.startsWith(repoRoot)

  if(!isTestRoot){
    if(skipThrow) return false
  
    throw new Exception(
      `You do not have permission to preform this action!`,
      403
    )
  }

  return true
}

const isWorldFile = (
  repo:Repo,
  location:string,
) => getPathFromConfig(`world`, repo) === location


const isEnvFile = (
  repo:Repo,
  location:string,
  type:string
) => {
  
  const {
    type:repoEnvType,
    location:repoLocation,
  } = get(repo, `fileTypes.env`, { type: ``, location: `` })

  if(!location.startsWith(repoLocation)) return false

  const pathExt = path.extname(location).replace(/^\./, ``)
  const locIsType = pathExt === type

  if(repoEnvType !== type && (locIsType || pathExt !== repoEnvType)) return false

  // TODO: figure out how to handle this
  // The location extension matches the repo env type
  // But the passed in type does not match the repo.env type
  // Which means the type of the file is miss-labeled 
  // if(repoEnvType !== type && pathExt === repoEnvType){}

  return true
}

/**
 * Helper to validate if the location is the path to the goblet world file
 */
const shouldReloadWorld = (
  repo:Repo,
  location:string,
) => {

  if(isWorldFile(repo, location)) return true

  // Check if the file name includes "world"
  // This is a hard requirement that all world extensions must have "world" in their name
  if(!nPath.basename(location).includes(`world`)) return false
  
  // Check the $merge array of the world to see if the file change should update the world
  // This is non-recursive, so sub-files of merge files would not be found
  // Basically it's just one level deep
  const { $merge } = repo.world
  // Check if merge is empty
  if(!$merge?.length) return false

  // File must have the allow extension type
  const hasExt = AllowedWorldExtensions.includes(path.extname(location))
  if(!hasExt) return false

  // Ensure the file is located in the goblet base directory
  // This was probably already checked, but doesn't hurt to do again
  const baseDir = getRepoGobletDir(repo)
  if(!location.startsWith(baseDir)) return false

  // Get the file relative to the baseDir because that's how they are loaded when
  // The World object is loaded
  const noBaseLoc = location.replace(baseDir, ``).replace(/^\//, ``)
  // Check if the file exists in the merge array
  const inMerge = $merge.find((item:string) => !item.startsWith(`@`)  && item.endsWith(noBaseLoc))

  return Boolean(inMerge)
}


/**
 * Helper method to update the repo world anytime the world file is accessed
 */
const reloadWorld = async (
  repo:Repo,
  location:string,
  content?:string
) => {

  const world = await repo.refreshWorld()

  return await buildFileModel({
    content,
    location: location,
    ast: { world: omitKeys(world, [`secrets`]) },
    fileType: repo.fileTypes.json.type,
  }, repo)
}

/**
 * Deletes a file at a given location. file should be located in the test root path
 * @param repo - Repo Class instance for the currently active repo
 * @param location - Location within the test root path the file should be deleted
 *
 * @returns - Contains boolean if delete was successful and its location
 */
export const deleteGobletFile = async (
  repo:Repo,
  location:string
) => {
  await checkPathExists(location)

  inRepoRoot(repo, location)

  if(isWorldFile(repo, location))
    throw new Exception(
      `The world file can not be deleted`,
      403
    )

  const [err] = await limbo(fs.remove(location))
  if (err)
    throw new Exception({
      err,
      status: 500,
      msg: `File could not be removed: ${location}`,
    })

  return {
    location,
    success: true,
  }
}

/**
 * Checks the files path and if it exists creates a fileModel from the meta data
 * @param repo - Repo Class instance for the currently active repo
 * @param location - Location within the test root path the file should exist
 *
 * @returns - fileModel for the file at the passed in location
 */
export const getGobletFile = async (
  repo:Repo,
  location:string
) => {
  const baseDir = getRepoGobletDir(repo)

  const fullPath = location.startsWith(baseDir)
    ? location
    : path.join(baseDir, location)

  await checkPathExists(fullPath)

  // Check the fileType, and handle some files with their own method
  const fileType = resolveFileType(repo, fullPath)
  const envFile = isEnvFile(repo, location, fileType)

  if(fileType === get(repo, `fileTypes.feature.type`))
    return await loadFeature(repo, fullPath)

  else if(fileType === get(repo, `fileTypes.report.type`))
    return await loadReport(repo, fullPath, baseDir)

  const [_, content] = envFile
    ? await repo?.latent?.getFile({ repo, location })
    : await readFile(fullPath)

  if(envFile || shouldReloadWorld(repo, fullPath))
    return await reloadWorld(repo, fullPath, content)

  // Build the file model for the file
  return await buildFileModel({
    content,
    fileType,
    location: fullPath,
  }, repo)
}

/**
 * Save a definition file in the mounted repo when it's a modified version of the default definitions
 * @param repo - Repo Class instance for the currently active repo
 * @param location - Location within the test root path the file should be saved
 * @param content - Content of the file to be saved
 *
 * @returns - Contains boolean if save was successful and its fileModel
 */
const convertDefaultDefToCustomDef = (
  repo:Repo,
  location:string,
  overrideFolder:string=DefinitionOverrideFolder
) => {
  const definitionType = get(repo, `fileTypes.definition`)
  if(!definitionType || !definitionType.location)
    throw new Exception(
      `Definition file type does not exist for mounted repo!`,
      404
    )

  return path.join(definitionType.location, overrideFolder, path.basename(location))
}


/**
 * Loads a definition from the included default goblet step definitions
 * If found, converts the path to the repos sept dir
 * Treats the file like it exists in the repo directly
 *
 */
export const getGobletDefaultFile = async (
  config:TDefGobletConfig,
  repo:Repo,
  location:string
) => {
  const { internalPaths } = config
  const defaultStepsDir = internalPaths.defaultStepsDir

  if(!location.startsWith(defaultStepsDir))
    throw new Exception(
      `You do not have permission to preform this action!`,
      403
    )

  const repoLoc = convertDefaultDefToCustomDef(repo, location)
  const [_, content] = await readFile(location)

  // Build the file model for the file
  return await buildFileModel({
    content,
    location: repoLoc,
    fileType: `definition`,
  }, repo)

}

/**
 * Save file at a given location. File should be located in the test root path
 * @param repo - Repo Class instance for the currently active repo
 * @param location - Location within the test root path the file should be saved
 * @param content - Content of the file to be saved
 * @param type - The file type being saved
 *
 * @returns - Contains boolean if save was successful and its fileModel
 */
export const saveGobletFile = async (
  repo:Repo,
  location:string,
  content:string,
  type:string
) => {

  let saveLocation = location
  const isInRoot = inRepoRoot(repo, location, true)

  // Check the file type, and if it's a definition then create a new definition file
  // This allows saving definitions form the standard lib in to the users lib
  // Should then override the standard lib definition file
  if (!isInRoot){
    if(get(repo, `fileTypes.definition.type`) !== type)
      throw new Exception(
        `You do not have permission to preform this action!`,
        403
      )

    // Overwrite the save location with the update path to the file location within the repo
    saveLocation = convertDefaultDefToCustomDef(repo, location)
  }

  const envFile = isEnvFile(repo, location, type)

  // TODO: Need to check if this is the wold file
  // Then ensure extra properties are not added to it
  const [err, success] = envFile
    ? await repo?.latent?.saveFile({ repo, content, location })
    : await writeFile(saveLocation, content)

  if (err)
    throw new Exception({
      err,
      status: 404,
      msg: `Save failed: ${saveLocation} - ${err.message}`,
    })

  // Check the fileType, and handle some files with their own method
  const fileType = type || resolveFileType(repo, saveLocation)

  let fileModel:TFileModel
  if(fileType === get(repo, `fileTypes.feature.type`))
    fileModel = await loadFeature(repo, saveLocation)

  // TODO: need to update parkin to allow loading a single definition
  // else if(fileType === get(repo, `fileTypes.definition.type`))
  //   fileModel = await loadDefinition(repo, saveLocation)

  else if(fileType === get(repo, `fileTypes.report.type`))
    fileModel = await loadReport(repo, saveLocation)

  else if(envFile || shouldReloadWorld(repo, saveLocation))
    fileModel = await reloadWorld(repo, saveLocation, content)

  else fileModel = await buildFileModel({
    content,
    fileType: type,
    location: saveLocation,
  }, repo)

  return {
    success: Boolean(success && fileModel),
    file: fileModel
  }
}

/**
 * Renames file at a given location. File should be located in the test root path
 * @param repo - Repo Class instance for the currently active repo
 * @param location - Location within the test root path the file should be saved
 * @param type - The file type being renamed
 *
 * @returns - Contains boolean if save was successful and its fileModel
 */
export const renameGobletFile = async (
  repo:Repo,
  oldLoc:string,
  newLoc:string,
  content?:string
) => {
  
  // Ensure both old and new locations are in the test root dir
  inRepoRoot(repo, oldLoc)
  inRepoRoot(repo, newLoc)
  
  // Ensure we are not renaming the world file
  if(isWorldFile(repo, oldLoc))
    throw new Exception(
      `The world file can not be modified`,
      403
    )

  await checkPathExists(oldLoc)
  const existingLoc = await checkPathExists(newLoc, true)

  if(existingLoc)
    throw new Exception({
      status: 400,
      msg: `File path "${newLoc}" already exists`,
      err: isBool(existingLoc) ? `Unknown file status` : existingLoc,
    })

  const moved = await limbo(fs.move(oldLoc, newLoc))
  
  if(exists(content) && isStr(content)){
    const [err] = await writeFile(newLoc, content)
    if (err)
      throw new Exception({
        err,
        status: 404,
        msg: `Save failed: ${newLoc} - ${err.message}`,
      })
  }

  const file = await getGobletFile(repo, newLoc)

  return {
    file,
    success: moved,
    location: newLoc,
  }

}

/**
 * Create a file based on location and location
 * Only saved within the docker mounted test root path
 * @param repo - Repo Class instance for the currently active repo
 * @param location - Name / Location of the file to be saved
 * @param fileType - The type of file to be saved, one of the FILE_TYPES constants
 *
 * @returns - Contains boolean if create was successful and its fileModel
 */
export const createGobletFile = async (
  repo:Repo,
  location:string,
  fileType:string,
  content:string=``
) => {

  // Validate we are creating the file in the test root directory
  inRepoRoot(repo, location)

  // Check if the path already exists, so we don't overwrite an existing file
  const [existsErr, fileExists] = await limbo(fs.pathExists(location))
  if (fileExists)
    throw new Exception(`File already exists at that location!`, 422)

  if(fileType === `folder`){
    const [mkDErr] = await limbo(fs.ensureDir(location))
    if (mkDErr) throw new Exception(mkDErr, 422)

    const [gobErr] = await ensureGobletKeep(location)
    if (gobErr) throw new Exception(gobErr as Error, 422)

    return {
      success: true,
      // Build the file model for the new test file
      file: await buildFileModel(
        { fileType,
          location,
        },
        repo
      ),
    }

  }

  const dirname = path.dirname(location)

  // Ensure the directory exists for the file
  const [mkDirErr] = await limbo(fs.ensureDir(dirname))
  if (mkDirErr) throw new Exception(mkDirErr, 422)

  const [writeErr, writeSuccess] = await writeFile(location, content)
  if (writeErr) throw new Exception(writeErr, 400)

  return {
    success: Boolean(writeSuccess),
    // Build the file model for the new test file
    file: await buildFileModel(
      {
        content,
        fileType,
        location,
      },
      repo
    ),
  }
}

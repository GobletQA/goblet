import type { Repo } from '@GSH/repo/repo'
import type { TDefGobletConfig } from '../../types'

import path from 'path'
import fs from 'fs-extra'
import { Exception } from '@GException'
import { limbo } from '@keg-hub/jsutils'
import { fileSys } from '@keg-hub/cli-utils'
import { loadReport } from '@GSH/utils/loadReport'
import { wordCaps, get, isBool } from '@keg-hub/jsutils'
import { loadFeature } from '@GSH/libs/features/features'
import { buildFileModel } from '@GSH/utils/buildFileModel'
import { loadTemplate } from '@GSH/templates/loadTemplate'
import { resolveFileType } from '@GSH/utils/resolveFileType'
import { getRepoGobletDir } from '@GSH/utils/getRepoGobletDir'
import { DefinitionOverrideFolder } from '@GSH/constants'

const {
  readFile,
  writeFile,
} = fileSys

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

const inTestRoot = (
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

  inTestRoot(repo, location)

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

  if(fileType === get(repo, `fileTypes.feature.type`))
    return await loadFeature(repo, fullPath)
  else if(fileType === get(repo, `fileTypes.report.type`))
    return await loadReport(repo, fullPath, baseDir)

  // Build the file model for the file
  const [_, content] = await readFile(fullPath)

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

  return path.join(definitionType.location, `override`, path.basename(location))
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
  const isInRoot = inTestRoot(repo, location, true)

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

  const [err, success] = await writeFile(saveLocation, content)

  if (err)
    throw new Exception({
      err,
      status: 404,
      msg: `Save failed: ${saveLocation} - ${err.message}`,
    })

  return {
    success: Boolean(success),
    file: await buildFileModel({
      content,
      location: saveLocation,
    }, repo)
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
) => {
  
  // Ensure both old and new locations are in the test root dir
  inTestRoot(repo, oldLoc)
  inTestRoot(repo, newLoc)

  await checkPathExists(oldLoc)
  const existingLoc = await checkPathExists(newLoc, true)

  if(existingLoc)
    throw new Exception({
      status: 400,
      msg: `File path "${newLoc}" already exists`,
      err: isBool(existingLoc) ? `Unknown file status` : existingLoc,
    })

  const moved = await limbo(fs.move(oldLoc, newLoc))
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
  fileType:string
) => {

  inTestRoot(repo, location)

  // Check if the path already exists, so we don't overwrite an existing file
  const [existsErr, fileExists] = await limbo(fs.pathExists(location))
  if (fileExists)
    throw new Exception(`File already exists at that location!`, 422)

  if(fileType === `folder`){
    const [mkDErr, mkDSuccess] = await limbo(fs.ensureDir(location))
    if (mkDErr) throw new Exception(mkDErr, 422)

    return {
      success: true,
      // Build the file model for the new test file
      file: await buildFileModel(
        {
          fileType,
          location,
        },
        repo
      ),
    }

  }

  const basename = path.basename(location)
  const dirname = path.dirname(location)

  // Ensure the directory exists for the file
  const [mkDirErr, mkDirSuccess] = await limbo(fs.ensureDir(dirname))
  if (mkDirErr) throw new Exception(mkDirErr, 422)

  // Create the new test file using the template for the file type
  // In the future we might want to allow custom templates from the mounted tests folder
  // But that's a lot more work
  const content = await loadTemplate(fileType, {
    name: wordCaps(basename.split('.').shift()),
  })

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

import type { Repo } from '@GSH/repo/repo'

import path from 'path'
import { Exception } from '@GException'
import { fileSys } from '@keg-hub/cli-utils'
import { loadReport } from '@GSH/utils/loadReport'
import { wordCaps, get, isBool } from '@keg-hub/jsutils'
import { loadFeature } from '@GSH/libs/features/features'
import { buildFileModel } from '@GSH/utils/buildFileModel'
import { loadTemplate } from '@GSH/templates/loadTemplate'
import { resolveFileType } from '@GSH/utils/resolveFileType'
import { getRepoGobletDir } from '@GSH/utils/getRepoGobletDir'

const {
  mkDir,
  movePath,
  readFile,
  writeFile,
  removeFile,
  pathExists
} = fileSys

/**
 * Checks that the file path exists
 * @param {String} location - file path to check
 * @throw {Error} if location not found on file system
 */
const checkPathExists = async (location:string, skipThrow?:boolean) => {
  const [err, exists] = await pathExists(location)

  if ((err || !exists) && !skipThrow)
    throw new Exception({
      err,
      status: 400,
      msg: `Path not found: ${location}`,
    })

  return err || exists ? true : false
}

const inTestRoot = (
  repo:Repo,
  location:string,
  skipThrow?:boolean
) => {
  // Check that the file being remove is in the mounted repo folder
  // This ensure no other files can be removed
  const { repoRoot } = repo.paths
  const inTestRoot = location.startsWith(repoRoot)

  if(!inTestRoot){
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

  const [err] = await removeFile(location)
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
const saveDefinitionToRepo = async (
  repo:Repo,
  location:string
) => {
  const definitionType = get(repo, `fileTypes.definition`)
  if(!definitionType || !definitionType.location)
    throw new Exception(
      `Definition file type does not exist for mounted repo!`,
      404
    )

  return path.join(definitionType.location, path.basename(location))
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
    saveLocation = await saveDefinitionToRepo(repo, location)
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
      msg: `Path not found: ${location}`,
      err: isBool(existingLoc) ? `Unknown file status` : existingLoc,
    })

  const moved = await movePath(oldLoc, newLoc)

  return {
    success: moved,
    location: newLoc,
  }

}

/**
 * Create a file based on location and fileName
 * Only saved within the docker mounted test root path
 * @param repo - Repo Class instance for the currently active repo
 * @param fileName - Name / Location of the file to be saved
 * @param fileType - The type of file to be saved, one of the FILE_TYPES constants
 *
 * @returns - Contains boolean if create was successful and its fileModel
 */
export const createGobletFile = async (
  repo:Repo,
  fileName:string,
  fileType:string
) => {
  const { fileTypes } = repo
  const foundType = fileTypes[fileType]

  // Ensure the test type exists
  // If not, then we can't create the file
  if (!foundType)
    throw new Exception(
      `Invalid test type "${fileType}". Must be one of\n${Object.keys(fileTypes)}`,
      400
    )

  // Build the path to the file and it's meta data
  const location = path.join(foundType.location, fileName)

  // Check if the path already exists, so we don't overwrite an existing file
  const [existsErr, fileExists] = await pathExists(location)
  if (fileExists)
    throw new Exception(`File already exists at that location!`, 422)

  const basename = path.basename(location)
  const dirname = path.dirname(location)

  // Ensure the directory exists for the file
  const [mkDirErr, mkDirSuccess] = await mkDir(dirname)
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

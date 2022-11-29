import type { Repo } from '../repo/repo'
import type  { TFileModel } from '../types'

import fs from 'fs'
import path from 'path'
import mime from 'mime'
import { fileModel } from '@GSH/models'
import { getFileType } from './getFileType'
import { limboify } from '@keg-hub/jsutils'

/**
 * getType seemed to stop working, the owner of the package is doing odd things
 * So we normalize the getType and lookup methods incase one can't be found
 */
const getMime = (location:string) => {
  const ext = path.extname(location).replace(`.`, ``)
  // @ts-ignore
  return mime?.types?.[ext] || mime?._types?.[ext] || `text/plain`
}

/**
 * Gets the meta data for a file or folder based on the passed in filePath
 * @function
 * @param {string} fromPath - Path to get the content from
 *
 * @returns {Promise|Object} - Meta data of the passed in path
 */
export const getLastModified = async (filePath:string) => {
  const [__, metaData] = await limboify(
    fs.stat,
    filePath
  )

  // Return the mtimeMs (POSIX Epoch in milliseconds)
  // Either from the files stats, or current time
  return metaData ? metaData.mtimeMs : Date.now()
}


/**
 * Builds a fileModel from the fileModel object and passed arguments
 * @param fileModel - Partial fileModel merged with the default
 * @param [repo={}] - Repo Class instance for the currently active repo
 *
 * @returns - Built fileModel object containing all fileModel properties
 */
export const buildFileModel = async (
  data:Partial<TFileModel>,
  repo:Repo
) => {
  const { location, uuid, ...modelData } = data
  
  const fileType = data.fileType || getFileType(location, repo.fileTypes)
  
  let finalLoc = location
  let name = location.split('/').pop()

  if(fileType === `folder`){
    // Ensure a / at the end when it's a folder
    const finalLoc = location.endsWith(`/`) ? location : `${location}/`
    // To get the name, split on / and get the second to last value
    // This ensures we always get the folder name, and not the last empty string from / split
    const split = finalLoc.split('/')
    split.pop()
    name = split.pop()
  }

  return fileModel({
    ...modelData,
    name,
    fileType,
    uuid: finalLoc,
    location: finalLoc,
    mime: getMime(location),
    ext: path.extname(location).replace('.', ''),
    lastModified: await getLastModified(location),
    relative: location.replace(repo.paths.repoRoot, ''),
  })
}

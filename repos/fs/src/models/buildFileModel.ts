import type { Repo, TFileModel } from '@GFS/types'

import path from 'path'
import { getMime } from '@GFS/utils/getMime'
import { fileModel } from '@GFS/models/fileModel'
import { getLastModified } from '@GFS/utils/getLastModified'
import { resolveFileType } from '@GSH/models/resolveFileType'


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
  
  const fileType = data.fileType || resolveFileType(repo, location)
  
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

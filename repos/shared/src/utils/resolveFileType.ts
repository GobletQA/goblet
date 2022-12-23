import type { TRepo, TFileType } from '../types'

/**
 * Loops over the fileTypes from the repo looking for a matching path with the filePath
 * If found uses the matching type
 */
export const resolveFileType = (
  repo:TRepo,
  filePath:string
) => {
  const { fileTypes } = repo

  return Object.entries(fileTypes)
  .reduce((found, [typeName, metaData]:[string, TFileType]) => {
    if(found || !metaData || !metaData.location) return found
    
    return filePath.startsWith(metaData.location)
      ? metaData.type || typeName
      : found
  }, ``)
}

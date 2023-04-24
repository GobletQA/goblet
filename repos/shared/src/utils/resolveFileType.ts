import type { TRepo, TFileType } from '../types'

import path from 'path'

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

    // JSON files are a valid file type, but are not stored in a specific location
    // So we just check the extension of the file to validate it's type
    if(metaData.type === `json` && path.extname(filePath) === `.${metaData.type}`)
      return metaData.type
    
    return filePath.startsWith(metaData.location)
      ? metaData.type || typeName
      : found
  }, ``)
}

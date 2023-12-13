import type { Repo, TFileType } from '@GFS/types'

import path from 'node:path'

/**
 * Loops over the fileTypes from the repo looking for a matching path with the filePath
 * If found uses the matching type
 */
export const resolveFileType = (
  repo:Repo,
  filePath:string
) => {

  const { fileTypes } = repo
  const fileExt = path.extname(filePath).replace(/^\./, ``)

  if(fileTypes[fileExt]) return fileTypes[fileExt].type || fileExt

  return Object.entries(fileTypes)
  .reduce((found, [typeName, metaData]:[string, TFileType]) => {
    if(found || !metaData || !metaData.location) return found

    // JSON files are a valid file type, but are not stored in a specific location
    // So we just check the extension of the file to validate it's type
    if(metaData.type === `json` && fileExt === metaData.type)
      return metaData.type

    else
      return filePath.startsWith(metaData.location)
        ? metaData.type || typeName
        : found

  }, ``)

}

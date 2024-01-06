import type { TFileType, TFileTypes } from '@types'

import { getStore } from '@store'
import { noOpObj, isObj } from '@keg-hub/jsutils'

type TCheckTypes = {
  type:string,
  fileName:string,
  isFolder?:boolean,
  typeMeta?:TFileType
  fileTypes?:TFileTypes
  fileType:string|TFileType
}

type TCheckFileExt = {
  fileName:string,
  typeMeta?:TFileType
  fileType:string|TFileType,
}

/**
 * Gets the file type meta for the repo from the store
 */
const getTypesMeta = (fileType:string|TFileType) => {
  const { repo } = getStore().getState()
  const fileTypes = repo?.fileTypes
  
  return {
    fileTypes,
    typeMeta: isObj<TFileType>(fileType) ? fileType : fileTypes?.[fileType]
  }
}

/**
 * Checks the passed in type and fileType
 * Validates if it's a folder or if the fileType and fileTypes are missing
 */
const checkFileTypes = ({
  type,
  fileType,
  fileName,
  isFolder,
  typeMeta,
  fileTypes,
}:TCheckTypes) => {

  if(isFolder)
    return {
      file:fileName,
      typeMeta: { type, ext: ``, location: ``, }
    }

  if(fileType === `file`)
    return {
      file:fileName,
      typeMeta: { type, ext: ``, location: fileName }
    }

  if(!fileTypes)
    return {
      file: ``,
      typeMeta: noOpObj as TFileType,
      error: `Missing valid file types for repo. Please reconnect the repository`,
    }

  if(!typeMeta || !typeMeta.ext)
    return {
      file: ``,
      typeMeta,
      error: [
        `File type "${fileType}" is misconfigured in the repos "goblet.config.js".`,
        `Please fix configuration for this file type to resolve the issue.`
      ].join(`\n`),
    }

  return undefined
}

/**
 * Checks the file extension based on file name and allowed types
 */
const checkFileExt = ({
  fileName,
  typeMeta,
  fileType,
}:TCheckFileExt) => {

  const ext = typeMeta?.ext
  if (!fileName.includes('.')) return { file: `${fileName}.${ext}`, typeMeta }

  const last = fileName.split('.').pop()
  return last === ext
    ? {file: fileName, typeMeta}
    : {
        file: ``,
        typeMeta,
        error: [
          `Invalid extension ".${last}".`,
          `Files of type "${fileType}" must include ".${ext}" at the end.`
        ].join(`\n`),
      }
}

/**
 * Checks the file extension based on fileType, and adds it if needed
 */
export const ensureExtension = (
  fileType:string|TFileType,
  fileName:string,
  isFolder?:boolean,
) => {
  
  const type = isObj(fileType) ? fileType.type : fileType
  const { typeMeta, fileTypes } = getTypesMeta(fileType)

  return checkFileTypes({
    type,
    isFolder,
    fileName,
    typeMeta,
    fileType,
    fileTypes,
  }) || checkFileExt({ fileName, typeMeta, fileType })

}

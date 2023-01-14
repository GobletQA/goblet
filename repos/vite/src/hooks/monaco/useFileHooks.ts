import type {
  TRepoState,
  TFileModel,
  TFilesState,
} from '@types'

import { noOpObj } from '@keg-hub/jsutils'
import { loadFile } from '@actions/files/api/loadFile'
import { saveFile } from '@actions/files/api/saveFile'
import { addRootToLoc } from '@utils/repo/addRootToLoc'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'
import { createFile } from '@actions/files/api/createFile'
import { removeFile } from '@actions/files/api/removeFile'
import { renameFile } from '@actions/files/api/renameFile'

import { useCallback, useMemo } from 'react'

export type THEditorFiles = {
  repo: TRepoState
  rootPrefix: string
  repoFiles: TFilesState
}

export type THOnLoadFile = THEditorFiles & {
  rootPrefix:string
  files: Record<string, string|null>
}

export const useOnLoadFile = ({
  rootPrefix,
  repoFiles,
}:THOnLoadFile) => {

  return useCallback(async (path:string) => {
    const full = addRootToLoc(path, rootPrefix)
    const existing = repoFiles?.files?.[full]?.content
    if(existing) return existing

    // The loadFile action will also update repoFiles.files
    // So we don't need to worry about it here
    const loaded = await loadFile(full)

    return loaded ? loaded?.content : null
  }, [
    rootPrefix,
    repoFiles
  ])
}

export const useOnRenameFile = (repoFiles:TFilesState, rootPrefix:string) => {
  return useCallback(async (oldFile:string, newFile:string) => {

    if(!oldFile) console.warn(`Can not rename file, missing old file location`)
    if(!newFile) console.warn(`Can not rename file, missing new file location`)

    const oldLoc = addRootToLoc(oldFile, rootPrefix)
    const newLoc = addRootToLoc(newFile, rootPrefix)

    await renameFile(oldLoc, newLoc)

  }, [repoFiles, rootPrefix])
}

export const useOnSaveFile = (repoFiles:TFilesState, rootPrefix:string) => {
  return useCallback(async (loc:string, content:string|null) => {
    if(content === null)
      return console.warn(`Can not save file with null content`)

    if(!loc)
      return console.warn(`Can not save file, missing file location`)

    const fullLoc = addRootToLoc(loc, rootPrefix)
    const fileModel = repoFiles?.files[fullLoc]

    if(!fileModel)
      return console.warn(`Can not save file. Missing file model at ${fullLoc}`)

    await saveFile({ ...(fileModel as TFileModel), content })

  }, [repoFiles?.files, rootPrefix])
}

export const useOnAddFile = (repoFiles:TFilesState, rootPrefix:string, repo:TRepoState) => {
  return useCallback(async (loc:string, isFolder?:boolean) => {
    if(!loc) console.warn(`Can not add file, missing file location`)
    
    const ext = loc.split(`.`).pop()

    const fileType = isFolder
      ? `folder`
      : Object.values(repo.fileTypes).find(typeObj => typeObj.ext === ext) || `file`

    const fullLoc = addRootToLoc(loc, rootPrefix)

    await createFile(fileType, fullLoc, isFolder)
  }, [repoFiles, rootPrefix, repo.fileTypes])
}

export const useOnDeleteFile = (repoFiles:TFilesState, rootPrefix:string) => {
  return useCallback(async (loc:string) => {
    if(!loc) console.warn(`Can not delete file, missing file location`)

    const fullLoc = addRootToLoc(loc, rootPrefix)
    const fileModel = repoFiles?.files[fullLoc]
    await removeFile(fileModel || { name: loc, location: fullLoc })

  }, [repoFiles, rootPrefix])
}

export const useEditorFiles = (props:THEditorFiles) => {
  const {
    repo,
    rootPrefix,
    repoFiles,
  } = props

  const files = useMemo(() => {
    if(!Object.values(repoFiles?.files || noOpObj).length) return {}

    return Object.entries(repoFiles?.files)
      .reduce((acc, [loc, model]) => {

        const key = rmRootFromLoc(loc, rootPrefix)
        acc[key] = model?.content || null

        return acc
      }, {} as Record<string, string|null>) ?? {}

  }, [
    rootPrefix,
    repo?.paths,
    repoFiles?.files,
  ])

  return {
    files,
    connected: Boolean(repo?.paths && repo?.name)
  }
}

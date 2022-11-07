import type { MutableRefObject } from 'react'
import type { TCodeEditorProps } from './CodeEditor'
import type {
  TRepoState,
  TFileTree,
  TFilesState,
  OpenFileTreeEvent,
  TEditorSettingValues
} from '@types'



import { exists } from '@keg-hub/jsutils'
import { UpdateModalEvt } from '@constants'
import { OpenFileTreeEvt } from '@constants'
import { confirmModal } from '@actions/modals/modals'
import { loadFile } from '@actions/files/api/loadFile'
import { saveFile } from '@actions/files/api/saveFile'
import { createFile } from '@actions/files/api/createFile'
import { removeFile } from '@actions/files/api/removeFile'
import { renameFile } from '@actions/files/api/renameFile'

import { useFileTree, useFiles, useRepo } from '@store'
import { useCallback, useEffect, useMemo } from 'react'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { toggleModal } from '@actions/modals/toggleModal'
import { useSettingValues } from '@hooks/store/useSettingValues'

export type THEditorFiles = {
  repo: TRepoState
  rootPrefix: string
  fileTree: TFileTree
  repoFiles: TFilesState
}

export type THOnLoadFile = THEditorFiles & {
  rootPrefix:string
  files: Record<string, string|null>
}


const modalActions = {
  close: () => {
    toggleModal(false)
  },
  open: (props?:Record<any, any>) => {
    EE.emit(UpdateModalEvt, props)
    confirmModal({ visible: true})
  },
}

const addRootToLoc = (loc:string, root:string) => `${root}${loc}`
const removeRootFromLoc = (loc:string, root:string) => loc.replace(root, ``)

const useOnLoadFile = ({
  rootPrefix,
  repoFiles,
}:THOnLoadFile) => {

  return useCallback(async (path:string) => {
    const full = addRootToLoc(path, rootPrefix)
    const existing = repoFiles?.pendingFiles?.[full] || repoFiles?.files?.[full]?.content
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

const useOnRenameFile = (repoFiles:TFilesState, rootPrefix:string) => {
  return useCallback(async (oldFile:string, newFile:string) => {

    if(!oldFile) console.warn(`Can not rename file, missing old file location`)
    if(!newFile) console.warn(`Can not rename file, missing new file location`)

    const oldLoc = addRootToLoc(oldFile, rootPrefix)
    const newLoc = addRootToLoc(newFile, rootPrefix)

    await renameFile(oldLoc, newLoc)

  }, [repoFiles, rootPrefix])
}

const useOnSaveFile = (repoFiles:TFilesState, rootPrefix:string) => {
  return useCallback(async (loc:string, content:string) => {
    if(!loc) console.warn(`Can not save file, missing file location`)

    // TODO: add auto same on blur
    const fullLoc = addRootToLoc(loc, rootPrefix)
    const fileModel = repoFiles?.files[fullLoc]

    if(!fileModel) console.warn(`Can not save file. Missing file model at ${fullLoc}`)

    await saveFile({ ...(fileModel || {}), content })

  }, [repoFiles, rootPrefix])
}

const useOnAddFile = (repoFiles:TFilesState, rootPrefix:string, repo:TRepoState) => {
  return useCallback(async (loc:string, isFolder:boolean) => {
    if(!loc) console.warn(`Can not add file, missing file location`)
    
    const ext = loc.split(`.`).pop()

    const fileType = isFolder
      ? `folder`
      : Object.values(repo.fileTypes).find(typeObj => typeObj.ext === ext)

    if(!fileType) throw new Error(`Invalid file type. Please use a valid file extension`)

    const fullLoc = addRootToLoc(loc, rootPrefix)

    await createFile(fileType, fullLoc, isFolder)
  }, [repoFiles, rootPrefix, repo.fileTypes])
}

const useOnDeleteFile = (repoFiles:TFilesState, rootPrefix:string) => {
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
    fileTree,
    rootPrefix,
    repoFiles,
  } = props

  const files = useMemo(() => {
    if(!repo?.fileTypes || !fileTree?.nodes) return {}

    const exts = Object.values(repo?.fileTypes)
      .map((fileType) => (fileType as Record<'ext', string>).ext)

    return Object.entries(fileTree?.nodes)
      .reduce((acc, [id, node]) => {
        const loc = node.location
        if(acc[loc]) return acc

        const ext = loc.split(`.`).pop() as string
        if(!exts.includes(ext)) return acc

        const model = repoFiles.files[loc]
        const key = model?.relative || removeRootFromLoc(loc, rootPrefix)
        acc[key] = repoFiles?.pendingFiles?.[loc] || model?.content || null

        return acc
      }, {} as Record<string, string|null>) ?? {}

  }, [
    rootPrefix,
    repo?.paths,
    repo?.fileTypes,
    fileTree?.nodes,
    repoFiles?.files,
  ])
  
  return {
    files,
    connected: Boolean(repo?.paths && repo?.name)
  }
}

export const useEditorHooks = (
  props:TCodeEditorProps,
  editorRef:MutableRefObject<any>
) => {

  const repo = useRepo()
  const repoFiles = useFiles()
  const fileTree = useFileTree()

  const rootPrefix = useMemo(() => {
    return repo?.paths?.workDir
      ? `${repo?.paths?.repoRoot}/${repo?.paths?.workDir}`
      : repo?.paths?.repoRoot
  }, [repo?.paths?.repoRoot, repo?.paths?.workDir])

  const editorFiles = useEditorFiles({
    repo,
    fileTree,
    repoFiles,
    rootPrefix,
  })

  const onLoadFile = useOnLoadFile({
    repo,
    fileTree,
    repoFiles,
    rootPrefix,
    ...editorFiles
  })
  
  const onPathChange = useCallback(async (path: string) => {
    // console.log(`------- onPath change -------`)
    // console.log(key)
  }, [fileTree, rootPrefix])

  const onValueChange = useCallback((value: any) => {
    // console.log(`------- onValueChange -------`)
    // console.log(value)
  }, [])

  const onFileChange = useCallback((path: any) => {
    // console.log(`------- file -------`)
    // console.log(file)
  }, [])

  const onDeleteFile = useOnDeleteFile(repoFiles, rootPrefix)
  const onAddFile = useOnAddFile(repoFiles, rootPrefix, repo)
  const onSaveFile = useOnSaveFile(repoFiles, rootPrefix)
  const onRenameFile = useOnRenameFile(repoFiles, rootPrefix)

  const options = useSettingValues<TEditorSettingValues>(`editor`)

  useEffect(() => {
    EE.on<OpenFileTreeEvent>(OpenFileTreeEvt, ({ size }) => {
      exists(size) && editorRef?.current?.resizeFileTree?.(size)
    }, `${OpenFileTreeEvt}-code-editor`)

    return () => {
      EE.off<OpenFileTreeEvent>(OpenFileTreeEvt, `${OpenFileTreeEvt}-code-editor`)
    }
  }, [])

  return {
    options,
    rootPrefix,
    onLoadFile,
    onFileChange,
    onPathChange,
    modalActions,
    onValueChange,
    onAddFile,
    onSaveFile,
    onRenameFile,
    onDeleteFile,
    ...editorFiles,
  }
}

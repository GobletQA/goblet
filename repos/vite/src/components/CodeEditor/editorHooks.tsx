import type { MutableRefObject } from 'react'
import type { TCodeEditorProps } from './CodeEditor'
import type { OpenFileTreeEvent, TRepoState, TFileTree, TFilesState } from '@types'


import { exists } from '@keg-hub/jsutils'
import { UpdateModalEvt } from '@constants'
import { OpenFileTreeEvt } from '@constants'
import { confirmModal } from '@actions/modals/modals'
import { loadFile } from '@actions/files/api/loadFile'
import { saveFile } from '@actions/files/api/saveFile'
import { useFileTree, useFiles, useRepo } from '@store'
import { useCallback, useEffect, useMemo } from 'react'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { toggleModal } from '@actions/modals/toggleModal'
import { removeFile } from '@actions/files/api/removeFile'

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
  return useCallback((loc:string) => {
    if(!loc) console.warn(`Can not rename file, missing file location`)
    console.log(`------- TODO - renameFile -------`)
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

const useOnAddFile = (repoFiles:TFilesState, rootPrefix:string) => {
  return useCallback((loc:string) => {
    if(!loc) console.warn(`Can not add file, missing file location`)
    
    console.log(`------- TODO - addFile -------`)
  }, [repoFiles, rootPrefix])
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
    if(!repo?.fileTypes || !fileTree?.paths) return {}

    const exts = Object.values(repo?.fileTypes)
      .map((fileType) => (fileType as Record<'ext', string>).ext)

    return fileTree?.paths?.reduce((acc, loc) => {
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
    fileTree?.paths,
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
  const onAddFile = useOnAddFile(repoFiles, rootPrefix)
  const onSaveFile = useOnSaveFile(repoFiles, rootPrefix)
  const onRenameFile = useOnRenameFile(repoFiles, rootPrefix)

  useEffect(() => {
    EE.on<OpenFileTreeEvent>(OpenFileTreeEvt, ({ size }) => {
      exists(size) && editorRef?.current?.resizeFileTree?.(size)
    }, `${OpenFileTreeEvt}-code-editor`)

    return () => {
      EE.off<OpenFileTreeEvent>(OpenFileTreeEvt, `${OpenFileTreeEvt}-code-editor`)
    }
  }, [])

  return {
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

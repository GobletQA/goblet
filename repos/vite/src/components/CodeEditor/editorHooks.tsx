import type { MutableRefObject } from 'react'
import type { TCodeEditorProps } from './CodeEditor'
import type { OpenFileTreeEvent, TRepoState, TFileTree, TFilesState } from '@types'


import { exists } from '@keg-hub/jsutils'
import { OpenFileTreeEvt } from '@constants'
import { loadFile } from '@actions/files/api/loadFile'
import { useFileTree, useFiles, useRepo } from '@store'
import { useCallback, useEffect, useMemo } from 'react'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { ModalTypes, UpdateModalEvt } from '@constants'
import { toggleModal } from '@actions/modals/toggleModal'
import { setActiveModal } from '@actions/modals/setActiveModal'

export type THOnLoadFile = THEditorFiles & {
  rootPrefix:string
  files: Record<string, string|null>
}

export type THEditorFiles = {
  repo: TRepoState
  repoPath: string,
  fileTree: TFileTree
  repoFiles: TFilesState
}

const modalActions = {
  close: () => {
    toggleModal(false)
  },
  open: (props?:Record<any, any>) => {
    EE.emit(UpdateModalEvt, props)
    setActiveModal(ModalTypes.Confirm, true)
  },
}

const addRootToLoc = (loc:string, root:string) => `${root}${loc}`
const removeRootFromLoc = (loc:string, root:string) => loc.replace(root, ``)

const useOnLoadFile = ({
  repoPath,
  repoFiles,
}:THOnLoadFile) => {

  return useCallback(async (path:string) => {
    const full = addRootToLoc(path, repoPath)
    const existing = repoFiles?.pendingFiles?.[full] || repoFiles?.files?.[full]?.content
    if(existing) return existing

    // The loadFile action will also update repoFiles.files
    // So we don't need to worry about it here
    const loaded = await loadFile(full)

    return loaded ? loaded?.content : null
  }, [
    repoPath,
    repoFiles
  ])
}


const useOnSaveFile = () => {
  return useCallback((loc:string, content:string) => {
    console.log(`------- on save file -------`)
  }, [])
}

const useOnAddFile = () => {
  return useCallback((loc:string) => {
    console.log(`------- on add file -------`)
  }, [])
}

const useOnDeleteFile = () => {
  return useCallback((loc:string) => {
    console.log(`------- on delete file -------`)
  }, [])
}

export const useEditorFiles = (props:THEditorFiles) => {
  const {
    repo,
    fileTree,
    repoPath,
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
      const key = model?.relative || removeRootFromLoc(loc, repoPath)
      acc[key] = repoFiles?.pendingFiles?.[loc] || model?.content || null

      return acc
    }, {} as Record<string, string|null>) ?? {}

  }, [
    repoPath,
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
  const repoPath = `${repo?.paths?.repoRoot}/${repo?.paths?.workDir}`

  const editorFiles = useEditorFiles({
    repo,
    fileTree,
    repoPath,
    repoFiles,
  })

  const rootPrefix = useMemo(() => {
    return repo?.paths?.workDir
      ? `${repo?.paths?.repoRoot}/${repo?.paths?.workDir}`
      : repo?.paths?.repoRoot
  }, [repo?.paths?.repoRoot, repo?.paths?.workDir])

  const onLoadFile = useOnLoadFile({
    repo,
    fileTree,
    repoPath,
    repoFiles,
    rootPrefix,
    ...editorFiles
  })
  
  const onPathChange = useCallback(async (path: string) => {
    // console.log(`------- onPath change -------`)
    // console.log(key)
  }, [fileTree, repoPath])

  const onValueChange = useCallback((value: any) => {
    // console.log(`------- onValueChange -------`)
    // console.log(value)
  }, [])

  const onFileChange = useCallback((path: any) => {
    // console.log(`------- file -------`)
    // console.log(file)
  }, [])

  const onDeleteFile = useOnDeleteFile()
  const onAddFile = useOnAddFile()
  const onSaveFile = useOnSaveFile()

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
    onDeleteFile,
    ...editorFiles,
  }
}

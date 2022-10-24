import type { OpenFileTreeEvent, TRepoState, TFileTree, TFilesState } from '@types'
import type { MutableRefObject } from 'react'
import type { TCodeEditorProps } from './CodeEditor'

import { EE } from '@gobletqa/shared/libs/eventEmitter'

import { exists } from '@keg-hub/jsutils'
import { OpenFileTreeEvt } from '@constants'
import { loadFile } from '@actions/files/api/loadFile'
import { useCallback, useEffect, useMemo } from 'react'
import { useFileTree, useFiles, useRepo } from '@store'

export type THEditorFiles = {
  repo: TRepoState
  fileTree: TFileTree
  repoFiles: TFilesState
}

export const useEditorFiles = (props:THEditorFiles) => {
  const {
    repo,
    fileTree,
    repoFiles,
  } = props
  
  const editorFiles = useMemo(() => {
    if(!repo?.fileTypes || !fileTree?.paths) return {}

    const exts = Object.values(repo?.fileTypes)
      .map((fileType) => (fileType as Record<'ext', string>).ext)

    return fileTree?.paths?.reduce((acc, loc) => {
      const ext = loc.split(`.`).pop() as string
      if(!exts.includes(ext)) return acc

      const fileModel = repoFiles.files[loc]

      const relative = loc.split(`${repo?.paths?.repoRoot}/${repo?.paths?.workDir}`).pop() as string
      acc[relative] = fileModel?.content || ``

      return acc
    }, {} as Record<string, string>) ?? {}
  }, [
    repo?.paths,
    repo?.fileTypes,
    fileTree?.paths,
    repoFiles?.files,
  ])
  
  return {
    editorFiles,
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
    repoFiles,
  })

  const onPathChange = useCallback(async (key: string) => {

    const found = fileTree.nodes.find(node => node.id === `${repoPath}${key}`)

    found
      ? await loadFile(found)
      : console.warn(`File could not be found with key ${key}`)

  }, [fileTree, repoPath])

  const onValueChange = useCallback((value: any) => {
    console.log(`------- value -------`)
    console.log(value)
  }, [])

  const onFileChange = useCallback((file: any) => {
    console.log(`------- file -------`)
    console.log(file)
  }, [])


  useEffect(() => {
    EE.on<OpenFileTreeEvent>(OpenFileTreeEvt, ({ size }) => {
      exists(size) && editorRef?.current?.resizeFileTree?.(size)
    }, `${OpenFileTreeEvt}-code-editor`)

    return () => {
      EE.off<OpenFileTreeEvent>(OpenFileTreeEvt, `${OpenFileTreeEvt}-code-editor`)
    }
  }, [])

  return {
    onFileChange,
    onPathChange,
    onValueChange,
    ...editorFiles,
  }
}

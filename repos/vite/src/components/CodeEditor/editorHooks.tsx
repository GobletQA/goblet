import type { OpenFileTreeEvent } from '@types'
import type { MutableRefObject } from 'react'
import type { TCodeEditorProps } from './CodeEditor'

import { EE } from '@gobletqa/shared/libs/eventEmitter'

import { exists } from '@keg-hub/jsutils'
import { OpenFileTreeEvt } from '@constants'
import { useCallback, useEffect, useMemo } from 'react'
import { useFileTree, useFiles, useRepo } from '@store'


export type THEditorFiles = {
  
}

export const useEditorFiles = () => {
  const fileTree = useFileTree()
  const repoFiles = useFiles()
  const repo = useRepo()
  
  const editorFiles = useMemo(() => {
    if(!repo?.fileTypes || !fileTree?.paths) return {}

    const exts = Object.values(repo?.fileTypes).map((fileType) => (fileType as Record<'ext', string>).ext)

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
    repo,
    fileTree,
    repoFiles,
    editorFiles,
    connected: Boolean(repo?.url && repo?.name)
  }
}


export const useEditorHooks = (
  props:TCodeEditorProps,
  editorRef:MutableRefObject<any>
) => {

  const onPathChange = useCallback((key: string) => {
    console.log(`------- path -------`)
    console.log(key)
  }, [])

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
  }
}

import type { OpenFileTreeEvent } from '@types'
import type { MutableRefObject } from 'react'

import { exists } from '@keg-hub/jsutils'
import { MonacoEditor } from '@gobletqa/monaco'
import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useFileTree, useFiles, useRepo } from '@store'

import { OpenFileTreeEvt, FileTreeWidth } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export type TCodeEditorProps = {
  
}


const useEditorHooks = (
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


export const CodeEditor = (props:TCodeEditorProps) => {
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
  

  const editorRef = useRef<any>(null)

  const {
    onFileChange,
    onPathChange,
    onValueChange,
  } = useEditorHooks(props, editorRef)

  return (
    <MonacoEditor
      ref={editorRef}
      // path={path}
      // value={value}
      defaultFiles={editorFiles}
      initialFileTreeStatus={true}
      initialFileTreeWidth={FileTreeWidth}
      onPathChange={onPathChange}
      onValueChange={onValueChange}
      onFileChange={onFileChange}
      options={{
        fontSize: 14,
        automaticLayout: true,
      }}
    />
  )
  
}
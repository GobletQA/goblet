import type { TLinter } from './useLintWorker'
import type { TTypes } from './useTypesWorker'
import type { Dispatch, MutableRefObject } from 'react'
import type { TEditorOpenFiles } from '../../types'
import type { editor, IDisposable } from 'monaco-editor'


import { useCallback } from 'react'

export type TUseRestoreModel = {
  curValueRef: MutableRefObject<string>
  prePath: MutableRefObject<string | null>
  lintWorkerRef: MutableRefObject<TLinter>
  typesWorkerRef: MutableRefObject<TTypes>
  editorStatesRef:MutableRefObject<Map<any, any>>
  setOpenedFiles: Dispatch<React.SetStateAction<TEditorOpenFiles>>
  onValueChangeRef: MutableRefObject<((v: string) => void) | undefined>
  contentListenerRef: MutableRefObject<IDisposable | undefined>
  editorRef: MutableRefObject<editor.IStandaloneCodeEditor | null>
  onFileChangeRef: MutableRefObject<((key: string, content: string) => void) | undefined>
}

export const useRestoreModel = (props:TUseRestoreModel) => {
  const {
    prePath,
    editorRef,
    curValueRef,
    lintWorkerRef,
    typesWorkerRef,
    setOpenedFiles,
    onFileChangeRef,
    editorStatesRef,
    contentListenerRef,
    onValueChangeRef,
  } = props

  return useCallback((path: string) => {
    const editorStates = editorStatesRef.current
    const model = window.monaco.editor
      .getModels()
      .find(model => model.uri.path === path)

    if (path !== prePath.current && prePath.current)
      editorStates.set(prePath.current, editorRef.current?.saveViewState())

    if (contentListenerRef.current && contentListenerRef.current.dispose)
      contentListenerRef.current.dispose()

    if (model && editorRef.current) {

      editorRef.current.setModel(model)

      if (path !== prePath.current) {
        const editorState = editorStates.get(path)
        if (editorState) editorRef.current?.restoreViewState(editorState)

        editorRef.current?.focus()
        let timer: any = null
        contentListenerRef.current = model.onDidChangeContent(() => {
          const v = model.getValue()
          setOpenedFiles(pre =>
            pre.map(v => {
              if (v.path === path) {
                v.status = 'editing'
              }
              return v
            })
          )
          // filesRef.current[path] = v;
          if (onFileChangeRef.current) {
            onFileChangeRef.current(path, v)
          }
          curValueRef.current = v
          if (onValueChangeRef.current) {
            onValueChangeRef.current(v)
          }
          
          if (timer) clearTimeout(timer)
          timer = setTimeout(() => {
            timer = null
            
            lintWorkerRef?.current?.postMessage({
              code: model.getValue(),
              version: model.getVersionId(),
              path,
            })
            
          }, 500)
          
        })
      }

      lintWorkerRef?.current?.postMessage({
        code: model.getValue(),
        version: model.getVersionId(),
        path,
      })

      prePath.current = path
      return model
    }
    return false
  }, [])
}
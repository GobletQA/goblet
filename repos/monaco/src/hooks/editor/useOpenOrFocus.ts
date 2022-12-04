import type { SetStateAction, RefObject, MutableRefObject } from 'react'
import type { editor } from 'monaco-editor'
import { TCodeEditorRef,TEditorOpenFiles } from '../../types'

import { useEffect, useCallback } from 'react'

export type TUseOpenOrFocus = {
  editorRef: TCodeEditorRef
  editorNodeRef: RefObject<HTMLDivElement>
  setCurPath: (content: SetStateAction<string>) => void
  setOpenedFiles: (content: SetStateAction<TEditorOpenFiles>) => void
  optionsRef: MutableRefObject<editor.IStandaloneEditorConstructionOptions>
}

export const useOpenOrFocus = (props:TUseOpenOrFocus) => {
  const {
    editorRef,
    optionsRef,
    setCurPath,
    editorNodeRef,
    setOpenedFiles,
  } = props

  const openOrFocusPath = useCallback((path: string) => {
    setOpenedFiles(pre => {
      let exist = false
      pre.forEach(loc => loc.path === path && (exist = true))

      return exist ? pre : [...pre, { path: path }]
    })
    setCurPath(path)
  }, [])


  useEffect(() => {
    editorRef.current = window.monaco.editor.create(editorNodeRef.current!, {
      ...optionsRef.current,
      model: null,
    })

    const editorService = (editorRef.current as any)._codeEditorService
    const openEditorBase = editorService.openCodeEditor.bind(editorService)

    editorService.openCodeEditor = async (input: any, source: any, sideBySide: any) => {
      const result = await openEditorBase(input, source)
      if (result === null) {
        const fullPath = input.resource.path
        source.setModel(window.monaco.editor.getModel(input.resource))
        openOrFocusPath(fullPath)
        source.setSelection(input.options.selection)
        source.revealLine(input.options.selection.startLineNumber)
      }

      // always return the base result
      return result
    }

    return () => {
      editorRef.current && editorRef.current.dispose()
    }
  }, [openOrFocusPath])
  
  return openOrFocusPath
}
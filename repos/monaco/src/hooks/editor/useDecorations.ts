import type { ForwardedRef, MutableRefObject } from 'react'
import type { editor } from 'monaco-editor'
import type {
  TMonaco,
  
  TCodeEditor,
  TCodeEditorRef,
} from '@GBM/types'

import { useEffect, useCallback, useRef, useState } from 'react'
import { useInline } from '@gobletqa/components'

export type THDecoration = {
  editorRef:TCodeEditorRef
  curPathRef: MutableRefObject<string>
}


export const useDecorations = (props:THDecoration) => {
  const {
    editorRef
  } = props

  const decorationsRef = useRef<editor.IModelDeltaDecoration[]>([])
  const collectionRef = useRef<editor.IEditorDecorationsCollection>()

  const addDecoration = useInline((decoration:editor.IModelDeltaDecoration) => {
    if(!editorRef?.current || !decoration) return
    
    const collection = collectionRef.current
    const decorations = decorationsRef.current
    if(collection) return collection?.set([...decorations, decoration])

    const updatedDecs = [...decorations, decoration]
    decorationsRef.current = updatedDecs

    const newCollection = editorRef.current?.createDecorationsCollection(updatedDecs)
    collectionRef.current = newCollection
  })

  const removeDecoration = useInline(() => {
    if(!editorRef?.current) return
    // TODO: make a copy of the decorations array
    // Then loop over it and remove the correct decoration
    // Then call decorations?.clear?.()
    // Then readd the copied decorations array with the decoration removed
    // decorations?.set?.(decorationsCopy)
  })

  const clearDecorations = useInline(() => {
    const collection = collectionRef.current
    collection?.clear()

    const decorations = decorationsRef.current
    decorationsRef.current = []
  })

  return {
    add: addDecoration,
    remove: removeDecoration,
    clear: clearDecorations,
  }

}
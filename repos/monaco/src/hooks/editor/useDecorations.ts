import type { editor } from 'monaco-editor'
import type {
  TDecorationCB,
  TDecorationFns,
  TCodeEditorRef,
  TDecorationAdd,
  TCollectionFiles,
  TDecorationFiles,
  TDecorationUpdate,
} from '@GBM/types'

import { useRef, useEffect } from 'react'
import { useInline } from '@gobletqa/components'
import { upsertDecos } from '@GBM/utils/decorations/upsertDecos'

export type THDecoration = {
  curPath: string
  editorRef:TCodeEditorRef
}

export const useDecorations = (props:THDecoration) => {
  const {
    curPath,
    editorRef,
  } = props

  const decorationsRef = useRef<TDecorationFiles>({})
  const collectionRef = useRef<TCollectionFiles>({})

  const addDecoration = useInline<TDecorationAdd>((location, decoration, meta) => {
    const updates = upsertDecos({
      meta,
      location,
      editorRef,
      updates: [decoration],
      collection: collectionRef.current,
      decorations: decorationsRef.current,
    })
    
    collectionRef.current = updates.collection
    decorationsRef.current = updates.decorations
  })

  const removeDecoration = useInline<TDecorationCB>(() => {
    console.warn(`Remove decoration method not implemented`)
  })

  const clearDecorations = useInline<TDecorationCB>((location:string) => {
    if(!location) return console.warn(`Can not clear decorations, missing file location`, location)
    if(!collectionRef.current[location]) return

    collectionRef.current[location]?.clear()
    delete collectionRef.current[location]
    delete decorationsRef.current[location]
  })

  const updateDecorations = useInline<TDecorationUpdate>((location, decorations, meta) => {
    const updates = upsertDecos({
      meta,
      location,
      editorRef,
      updates: decorations,
      collection: collectionRef.current,
      decorations: decorationsRef.current,
    })

    collectionRef.current = updates.collection
    decorationsRef.current = updates.decorations
  })

  useEffect(() => {
    const location = curPath
    const editor = editorRef.current as editor.IStandaloneCodeEditor
    if(!location || !editor) return

    // Remove any existing decorations that could cause conflict
    collectionRef.current[location]?.clear?.()
    delete collectionRef.current[location]

    // Check for decorations, and if they exist set them
    const decorations = decorationsRef.current[location]
    decorations
      && (collectionRef.current[location] = editor.createDecorationsCollection(Object.values(decorations)))
  }, [curPath])

  return {
    add: addDecoration,
    clear: clearDecorations,
    remove: removeDecoration,
    update: updateDecorations,
  } as TDecorationFns

}
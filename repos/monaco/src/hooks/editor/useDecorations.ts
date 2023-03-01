import type { MutableRefObject } from 'react'
import type { editor } from 'monaco-editor'
import type {
  TDecoration,
  TDecorationCB,
  TDecorationFns,
  TCodeEditorRef,
  TDecorationAdd,
  TDecorationList,
  TDecorationFiles,
  TDecorationUpdate,
} from '@GBM/types'

import { useRef, useEffect } from 'react'
import { useInline } from '@gobletqa/components'
import { validateMatch } from '@GBM/utils/editor/validateMatch'

export type THDecoration = {
  curPath: string
  editorRef:TCodeEditorRef
}

type TCollectionFiles = {
  [key:string]: editor.IEditorDecorationsCollection
}

const createDecoration = (
  decorationsList:TDecorationList,
  match:editor.FindMatch,
  decoration:TDecoration
) => {
  const range = match.range
  const { search, options } = decoration
  const decoId = `${range.startLineNumber}-${search}`
  
  decorationsList[decoId] = { options, range }

  return decorationsList
}

export const useDecorations = (props:THDecoration) => {
  const {
    curPath,
    editorRef,
  } = props

  const decorationsRef = useRef<TDecorationFiles>({})
  const collectionRef = useRef<TCollectionFiles>({})

  const addDecoration = useInline<TDecorationAdd>((location, decoration, meta) => {
    const decorationList = decorationsRef.current[location] || {} as TDecorationList
    const match = validateMatch({
      meta,
      location,
      editorRef,
      decoration,
      decorationList,
    })
    if(!match) return

    const editor = editorRef.current as editor.IStandaloneCodeEditor

    decorationsRef.current[location] = createDecoration(decorationList, match, decoration)
    const decorationsArr = Object.values(decorationsRef.current[location])

    collectionRef.current?.[location]
      ? collectionRef.current?.[location].set(decorationsArr)
      : (collectionRef.current[location] = editor.createDecorationsCollection(decorationsArr))

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

  const updateDecorations = useInline<TDecorationUpdate>((location, decoration, meta) => {
    addDecoration(location, decoration, meta)
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
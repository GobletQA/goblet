import type { MutableRefObject } from 'react'
import type { editor } from 'monaco-editor'
import type {
  TDecoration,
  TDecorationCB,
  TCodeEditorRef,
  TDecorationAdd,
  TDecorationMeta,
  TDecorationUpdate,
} from '@GBM/types'

import { useRef, useEffect } from 'react'

import { rangesEqual } from '@GBM/utils/editor/rangesEqual'
import { findTextMatch } from '@GBM/utils/editor/findTextMatch'
import { getModelFromPath } from '@GBM/utils/editor/getModelFromPath'

import { useInline } from '@gobletqa/components'

export type THDecoration = {
  curPath: string
  editorRef:TCodeEditorRef
}

type TDecorationList = {
  [key:string]: editor.IModelDeltaDecoration
}

type TDecorationFiles = {
  [key:string]: TDecorationList
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


const validate = (
  editorRef:TCodeEditorRef,
  decorationList:TDecorationList,
  location:string,
  decoration:TDecoration,
  meta:TDecorationMeta
) => {
  const editor = editorRef.current
  if(!editor) return console.warn(`Could not find editor`, editorRef.current, location, decoration, meta)

  if(!meta.action)
    return console.warn(`Can not add decoration, missing action type`, location, decoration, meta)

  const model = getModelFromPath(location)
  if(!model) return console.warn(`Could not find editor model for location`, location, decoration, meta)

  const { search } = decoration
  if(!search) return console.warn(`Can not add decoration, missing search text`, decoration, meta)
  
  const match = findTextMatch({
    meta,
    model,
    search,
    compare: (match) => {
      const id = `${match.range.startLineNumber}-${search}`
      // When action is start
      // Return the first match found that does not exist
      return meta.action === `start`
        ? !decorationList[id] ? match : false
        : rangesEqual(decorationList[id].range, match.range) ? match : false
    }
  })

  return match || console.warn(`Could not find match to search text`, search, location, meta)
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
    const match = validate(editorRef, decorationList, location, decoration, meta)
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
  }

}
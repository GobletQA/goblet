import type { MutableRefObject } from 'react'
import type { editor, Range } from 'monaco-editor'
import type {
  TMonaco,
  TDecoration,
  TCodeEditor,
  TDecorationCB,
  TCodeEditorRef,
  TDecorationAdd,
  TDecorationUpdate,
} from '@GBM/types'

import { useEffect, useCallback, useRef, useState } from 'react'
import { getModelFromPath } from '@GBM/utils/editor/getModelFromPath'
import { useInline } from '@gobletqa/components'

export type THDecoration = {
  editorRef:TCodeEditorRef
  curPathRef: MutableRefObject<string>
}

type TDecorationList = {
  [key:string]: editor.IModelDeltaDecoration
}

const getRangeByFeature = (model:editor.ITextModel) => {
    
  const fullRange = model.getFullModelRange()
  const featureMatches = model.findMatches(`Feature: `, fullRange, false, true, null, false)

  console.log(`------- featureMatches -------`)
  console.log(featureMatches)
}


const createDecoration = (
  decorationsRef:MutableRefObject<TDecorationList>,
  match:editor.FindMatch,
  decoration:TDecoration
) => {
  const range = match.range
  const { search, options } = decoration
  const decoId = `${range.startLineNumber}${search}`
  decorationsRef.current[decoId] = { options, range }
}
 
export const useDecorations = (props:THDecoration) => {
  const {
    editorRef
  } = props

  // TODO: clear decorations on file change
  // Otherwise they will be added to the other file when you switch

  const decorationsRef = useRef<TDecorationList>({} as TDecorationList)
  const collectionRef = useRef<editor.IEditorDecorationsCollection>()

  const addDecoration = useInline<TDecorationAdd>((location, decoration) => {
    const editor = editorRef.current
    if(!editor) return console.warn(`Could not find editor`, editorRef.current, location, decoration)

    const model = getModelFromPath(location)
    if(!model) return console.warn(`Could not find editor model for location ${location}`)
    
    const { search } = decoration
    if(!search) return

    const [match] = model.findMatches(search, true, false, false, null, false, 1)
    if(!match) return console.warn(`Could not find match to search text`, search, location, match)

    createDecoration(decorationsRef, match, decoration)

    if(collectionRef.current)
      collectionRef.current.set(Object.values(decorationsRef.current))
    else {
      collectionRef.current = editor.createDecorationsCollection([
        ...Object.values(decorationsRef.current)
      ])
    }

  })

  const removeDecoration = useInline<TDecorationCB>(() => {
    if(!editorRef?.current) return
    // TODO: make a copy of the decorations array
    // Then loop over it and remove the correct decoration
    // Then call decorations?.clear?.()
    // Then readd the copied decorations array with the decoration removed
    // decorations?.set?.(decorationsCopy)
  })

  const clearDecorations = useInline<TDecorationCB>(() => {
    collectionRef.current?.clear()
    decorationsRef.current = {} as TDecorationList
  })

  const updateDecorations = useInline<TDecorationUpdate>((location, decoration) => {
    addDecoration(location, decoration)
  })

  return {
    add: addDecoration,
    clear: clearDecorations,
    remove: removeDecoration,
    update: updateDecorations,
  }

}
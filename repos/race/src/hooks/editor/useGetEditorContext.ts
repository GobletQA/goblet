import type { TAskForEditor, TAnswerEditor, TEditorRef } from '@GBR/types'

import type { TEditorCtx } from '@GBR/contexts/EditorContext'

import { useEffect } from 'react'
import { useOnEvent, useEventEmit } from '@gobletqa/components'
import { AskForEditorEvt, RaceEmitEditorEvt } from '@GBR/constants'

export type THEditorContext = {
  editorRef:TEditorRef
  editorCtx: TEditorCtx
}

export const useGetEditorContext = (props:THEditorContext) => {
  const {
    editorRef,
    editorCtx,
  } = props

  // Helper to emit the editor context to any registered listeners
  const onEmitEditor = useEventEmit<TAnswerEditor>(RaceEmitEditorEvt, { editor: editorCtx })

  // Helper to allow external code ask the context for the current editor
  // Allows external actions to interface with the editor
  useOnEvent<TAskForEditor>(AskForEditorEvt, ({ cb }) => cb?.({ editor: editorCtx }))
  
  useEffect(() => {
    editorRef
      && editorCtx
      && (editorRef.current = editorCtx)

    onEmitEditor()
  }, [editorCtx])
  
}
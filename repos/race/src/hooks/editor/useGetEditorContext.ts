import type { TAnswerEditor, TEditorRef } from '@GBR/types'

import type { TEditorCtx } from '@GBR/contexts/EditorContext'

import { useEffect } from 'react'
import { AskForEditorEvt } from '@GBR/constants'
import { useOnEvent } from '@gobletqa/components'

export type THEditorContext = {
  editorRef:TEditorRef
  editorCtx: TEditorCtx
}

export const useGetEditorContext = (props:THEditorContext) => {
  const {
    editorRef,
    editorCtx,
  } = props

  // Helper to allow external code ask the context for the current feature
  // Allows external actions to interface with the currently active feature
  useOnEvent<TAnswerEditor>(AskForEditorEvt, ({ cb }) => cb?.({ editor: editorCtx }))
  
  useEffect(() => {
    editorRef.current = editorCtx
  }, [editorCtx])
  
}
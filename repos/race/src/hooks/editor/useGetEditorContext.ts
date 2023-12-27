import type { TAskForEditor, TAnswerEditor, TEditorRef } from '@GBR/types'

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


  // Helper to allow external code ask the context for the current editor
  // Allows external actions to interface with the editor
  useOnEvent<TAskForEditor>(AskForEditorEvt, ({ cb }) => cb?.({ editor: editorCtx }))
  
  useEffect(() => {
    editorRef
      && editorCtx
      && (editorRef.current = editorCtx)

  }, [editorCtx])
  
}
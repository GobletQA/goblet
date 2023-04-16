import type { TAnswerEditor } from '@GBR/types'

import type { TEditorCtx } from '@GBR/contexts/EditorContext'
import {  } from '@GBR/contexts/EditorContext'

import { AskForEditorEvt } from '@GBR/constants'
import { useOnEvent } from '@gobletqa/components'

export type THEditorContext = {
  editor: TEditorCtx
}

export const useGetEditorContext = (props:THEditorContext) => {
  const {
    editor
  } = props

  // Helper to allow external code ask the context for the current feature
  // Allows external actions to interface with the currently active feature
  useOnEvent<TAnswerEditor>(AskForEditorEvt, ({ cb }) => cb?.({ editor }))
}
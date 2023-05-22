import type { TAnswerEditor } from '@GBR/types'

import type { TEditorCtx } from '@GBR/contexts/EditorContext'

import { useOnEvent } from '@gobletqa/components'
import { RaceEmitEditorEvt } from '@GBR/constants'

export type THEditorCtx = (editor:TEditorCtx) => void

export const useRaceEditor = (cb:THEditorCtx) => {
  useOnEvent<TAnswerEditor>(RaceEmitEditorEvt, ({ editor }) => cb?.(editor))
}
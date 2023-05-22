import type {
  TAnswerDeco,
  TRaceDecoRef,
  TRaceDecoCtx,
} from '@GBR/types'

import { useEffect } from 'react'
import { useOnEvent, useEventEmit } from '@gobletqa/components'
import { AskForDecoEvt, RaceEmitDecoEvt } from '@GBR/constants'

export type THDecoContext = {
  decoRef?: TRaceDecoRef
  decorationsCtx:TRaceDecoCtx
}

export const useGetDecoContext = (props:THDecoContext) => {
  const {
    decoRef,
    decorationsCtx
  } = props

  // Helper to emit the editor context to any registered listeners
  const onEmitDeco = useEventEmit<TAnswerDeco>(RaceEmitDecoEvt, { decorations: decorationsCtx })

  // Helper to allow external code ask the context for the current editor
  // Allows external actions to interface with the editor
  useOnEvent<TAnswerDeco>(AskForDecoEvt, ({ cb }) => cb?.({ decorations: decorationsCtx }))
  
  useEffect(() => {
    decoRef
      && decorationsCtx
      && (decoRef.current = decorationsCtx)

    onEmitDeco()
  }, [decorationsCtx])

}

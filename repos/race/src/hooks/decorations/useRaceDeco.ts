import type {
  TAnswerDeco,
  TRaceDecoCtx,
} from '@GBR/types'


import { useOnEvent } from '@gobletqa/components'
import { RaceEmitDecoEvt } from '@GBR/constants'

export type THDecoCtx = (editor:TRaceDecoCtx) => void

export const useRaceDeco = (cb:THDecoCtx) => {
  useOnEvent<TAnswerDeco>(RaceEmitDecoEvt, ({ decorations }) => cb?.(decorations))
}

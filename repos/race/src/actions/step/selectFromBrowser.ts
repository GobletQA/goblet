import type { TExpPart, TStepParentAst, TStepAst } from '@GBR/types'
import type {
  TSelectFromBrowserEvent,
  TSelectFromBrowserRespEvent,
} from '@gobletqa/components'

import {
  SelectFromBrowserEvt,
  SelectFromBrowserRespEvt,
} from '@gobletqa/components'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export const selectFromBrowser = async (
  parent:TStepParentAst,
  step: TStepAst,
  expression:TExpPart
) => {

  let offEvent:any
  return new Promise<TSelectFromBrowserRespEvent>((res, rej) => {
    EE.emit<TSelectFromBrowserEvent>(SelectFromBrowserEvt, { parent, step, expression })

    offEvent = EE.on<TSelectFromBrowserRespEvent>(
      SelectFromBrowserRespEvt,
      (data) => {
        offEvent?.()
        res(data)
      }
    )
    // TODO: add timeout to throw an error if the SelectFromBrowserRespEvt never fires?
  })

}
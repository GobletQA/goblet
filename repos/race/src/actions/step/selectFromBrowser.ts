import type { TExpPart, TStepParentAst, TStepAst } from '@GBR/types'
import type { TSelectFromBrowserEvent } from '@gobletqa/components'

import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { SelectFromBrowserEvt } from '@gobletqa/components'

export const selectFromBrowser = (
  parent:TStepParentAst,
  step: TStepAst,
  expression:TExpPart
) => {
  EE.emit<TSelectFromBrowserEvent>(SelectFromBrowserEvt, { parent, step, expression })
}
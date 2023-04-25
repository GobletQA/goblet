import type { TToggleWorldEditorEvt } from '@GBR/types'

import { ToggleWorldEditorEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export const toggleWorldEditor = (state?:boolean) => {
  EE.emit<TToggleWorldEditorEvt>(ToggleWorldEditorEvt, { state })
}
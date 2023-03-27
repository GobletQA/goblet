import type { TAnswerEditor, TWithEditorCB } from '@GBR/types'

import { AskForEditorEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

/**
 * Helper to get the currently active editor from the context
 * Accepts a callback that will be called with the current editor context
 */
export const withEditor = (cb:TWithEditorCB) => {
  EE.emit(AskForEditorEvt, { cb })
}

/**
 * Helper to get the currently active editor from the context
 * Returns a promise that resolve to the current editor context
 */
export const getEditor = async ():Promise<TAnswerEditor> => {
  return await new Promise<TAnswerEditor>((res) => withEditor((resp) => res(resp)))
}
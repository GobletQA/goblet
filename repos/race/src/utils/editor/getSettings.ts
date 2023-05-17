import type { TWithSettingsCB } from '@GBR/types'
import type { TSettingsCtx } from '@GBR/contexts/SettingsContext'

import { AskForSettingsEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

/**
 * Helper to get the currently active editor from the context
 * Accepts a callback that will be called with the current editor context
 */
export const withSettings = (cb:TWithSettingsCB) => {
  EE.emit(AskForSettingsEvt, { cb })
}

/**
 * Helper to get the currently active editor from the context
 * Returns a promise that resolve to the current editor context
 */
export const getSettings = async ():Promise<TSettingsCtx> => {
  return await new Promise<TSettingsCtx>((res) => withSettings((resp) => res(resp)))
}

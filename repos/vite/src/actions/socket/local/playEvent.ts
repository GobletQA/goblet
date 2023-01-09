import type { TPlayerResEvent } from '@types'

import { PlayerTestEvt } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

/**
 * Emits a PlayerTestEvt event with just the Player test response data
 */
export const playEvent = (meta:TPlayerResEvent) => {
  // We only care about emitting the player test data if there's an ID to tie it to
  meta?.data?.id && EE.emit(PlayerTestEvt, meta)
}
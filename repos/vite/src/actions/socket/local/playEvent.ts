import type { TPlayerTestEventMeta } from '@types'

import { PlayerTestEvt } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

/**
 * Emits a PlayerTestEvt event with just the Player test response data
 */
export const playEvent = (meta:TPlayerTestEventMeta) => {
  EE.emit(PlayerTestEvt, meta.data)
}
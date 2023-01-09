import type { TPlayerResEvent } from '@types'

import { PlayerTestEvt } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

/**
 * Emits a PlayerTestEvt event with just the Player test response data
 */
export const playEvent = (meta:TPlayerResEvent) => {
  
  // TODO: If meta.name === "PLAY-ERROR", from a failed step
  // Then update the Current running feature and scenario to be failed as well
  // Well need to keep track of both some how

  // We only care about emitting the player test data if there's an ID to tie it to
  meta?.data?.id && EE.emit(PlayerTestEvt, meta)
}
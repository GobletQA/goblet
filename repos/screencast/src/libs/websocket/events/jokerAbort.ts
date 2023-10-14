import type { Express } from 'express'
import type { TJokerReq } from '@gobletqa/joker'
import type { TSocketEvtCBProps } from '@GSC/types'

import { jokerAI } from '@gobletqa/joker/jokerAI'

export const jokerAbort = (app:Express) => async ({
  data,
  socket,
  Manager,
}:TSocketEvtCBProps<TJokerReq>) => {
  await jokerAI.abort()
}

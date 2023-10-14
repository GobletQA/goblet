import type { Express } from 'express'
import type { TJokerReq } from '@gobletqa/joker'
import type { TSocketEvtCBProps } from '@GSC/types'

import { JokerResponse } from '@gobletqa/joker'
import { jokerAction } from '@GSC/libs/joker/jokerAction'

export const jokerRequest = (app:Express) => async ({
  data,
  socket,
  Manager,
}:TSocketEvtCBProps<TJokerReq>) => {

  const resp = await jokerAction(data)
  resp && Manager.emit(socket, JokerResponse, {data: resp})

}

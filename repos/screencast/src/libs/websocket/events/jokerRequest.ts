import type { Express } from 'express'
import type { TJokerReq } from '@gobletqa/joker'
import type { TSocketEvtCBProps } from '@GSC/types'

import { jokerAction } from '@GSC/libs/joker/jokerAction'
import { EJokerAction, JokerResponse } from '@gobletqa/joker'

export const jokerRequest = (app:Express) => async ({
  data,
  socket,
  Manager,
}:TSocketEvtCBProps<TJokerReq>) => {

  const resp = await jokerAction({
    ...data,
    // TODO: remove this once action is added to the request on the frontend
    // And the other actions are implmented
    action: EJokerAction.Question,
  })

  if(!resp) return

  Manager.emit(socket, JokerResponse, {data: resp})

}

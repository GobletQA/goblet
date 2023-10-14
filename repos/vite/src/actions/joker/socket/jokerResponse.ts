import type { TJokerSocketRes, TJokerRes } from '@types'

import {jokerDispatch} from "@store"
import { EJokerMessageType } from "@types"

const onSetRespChoices = (data:TJokerRes) => {
  data.choices.forEach((choice)=>{
    jokerDispatch.upsertJkrMessage({
      id: `${data?.id}-${choice.index}`,
      requestId: data?.requestId,
      type: EJokerMessageType.Joker,
      text: choice?.message?.content || ``,
    })
  })
}

const onError = (resp:TJokerSocketRes) => {
  const { message, data } = resp

  jokerDispatch.upsertJkrMessage({
    text: message,
    id: data?.id,
    requestId: data?.requestId,
    type: EJokerMessageType.Joker
  })
}


/**
 * Called from the jokerRequest actions promise, when the websocket jokerResponse event is fired
 * Is not called when the jokerRequest actions promise is canceled
*/
export const jokerResponse = (resp:TJokerSocketRes) => {
  resp.error
    ? onError(resp)
    : onSetRespChoices(resp?.data)
}
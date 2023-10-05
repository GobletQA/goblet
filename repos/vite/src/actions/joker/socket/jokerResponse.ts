import type { TJokerSocketRes, TJokerRes } from '@types'

import {jokerDispatch} from "@store"
import { EJokerMessageType } from "@types"
import { SocketMsgTypes } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

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

export const jokerResponse = (resp:TJokerSocketRes) => {
  EE.emit<TJokerSocketRes>(SocketMsgTypes.JOKER_RESPONSE, resp)

  resp.error
    ? onError(resp)
    : onSetRespChoices(resp?.data)
}
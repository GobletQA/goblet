import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

import {Logger} from '@GSC/utils/logger'
import { isStr } from '@keg-hub/jsutils/isStr'
import { limbo } from '@keg-hub/jsutils/limbo'
import { jokerAI } from '@gobletqa/joker/jokerAI'
import { JokerQReq, JokerQResp } from '@gobletqa/joker'

export const jokerSendMessage = (app:Express) => async ({ data, socket, Manager, user }:TSocketEvtCBProps) => {
  const {
    repo,
    text:question,
  } = data
  
  console.log(`------- data -------`)
  console.log(data)

  if(!isStr(question))
    return Logger.log(`Can not ask Joker, a question is required!`)


  const [err, resp] = await limbo(jokerAI.ask({ question }))

  console.log(`------- resp -------`)
  console.log(resp)

  Manager.emit(socket, JokerQResp, {...resp})
}

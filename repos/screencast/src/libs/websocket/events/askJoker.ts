import type { Express } from 'express'
import {Logger} from '@GSC/utils/logger'
import { TSocketEvtCBProps } from '@GSC/types'




import { isStr } from '@keg-hub/jsutils/isStr'
import { limbo } from '@keg-hub/jsutils/limbo'
import { jokerAI } from '@gobletqa/joker/jokerAI'
import { JokerQReq, JokerQResp } from '@gobletqa/joker'

import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'


export const askJoker = (app:Express) => async ({ data, socket, Manager, user }:TSocketEvtCBProps) => {
  const {
    question
  } = data

  if(!isStr(question))
    return Logger.log(`Can not ask Joker, a question is required!`)


  const [err, resp] = await limbo(jokerAI.ask({ question }))

  Manager.emit(socket, JokerQResp, {...resp})
}

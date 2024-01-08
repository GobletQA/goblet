import type { Response } from 'express'
import type { TAppOvReq, TApp } from '@gobletqa/shared/types'
import type { SocketManager } from '@GSC/libs/websocket/manager'

import { toNum } from '@keg-hub/jsutils'
import { apiRes, AppRouter } from '@gobletqa/shared/api'
import { WSIdleStatus } from '@gobletqa/environment/constants'

type TIdleSCParams = {
  counter?:string
  connections?:string
  state?:`idle`|`active`|`shutdown`
}

type TSCReq = TAppOvReq<TApp<{ SocketManager:SocketManager }>, TIdleSCParams>

/**
 * Endpoint to get the current status  of the browser
 */
export const scIdle = async (req:TSCReq, res:Response) => {
  const {
    state,
    counter,
    connections,
  } = req.query

  // Update all connected sockets of the current idle state
  const Manager = req.app.locals.SocketManager
  Manager.emitAll(WSIdleStatus, {
    data: {
      state,
      idle: state === `idle`,
      counter: toNum(counter),
      connections: toNum(connections),
    }
  })

  return apiRes(res, {}, 200)
}

AppRouter.get(`/idle-check`, scIdle)

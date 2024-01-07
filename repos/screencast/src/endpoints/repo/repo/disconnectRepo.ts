import type { Request, Response } from 'express'
import type { TKillTestRunUIRunEvtOpts } from '@GSC/types'

import { EE } from '@gobletqa/shared/utils'
import { workflows } from '@gobletqa/workflows'
import { apiRes, AppRouter } from '@gobletqa/shared/api'
import { KillTestRunUIProcEvt } from '@gobletqa/environment/constants'



/**
 * Disconnects a connected repo
 */
export const disconnectRepo = async (req:Request, res:Response) => {
  EE.emit<TKillTestRunUIRunEvtOpts>(KillTestRunUIProcEvt, { procId: `` })
  const repo = await workflows.disconnect(req.body)
  return apiRes(res, { repo }, 200)
}

AppRouter.post(`/repo/disconnect`, disconnectRepo)
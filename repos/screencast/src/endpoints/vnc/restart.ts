import type { Response, Request } from 'express'

import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { stopVNC, startVNC } from '@GSC/libs/vnc'

export const vncRestart = asyncWrap(async (req:Request, res:Response) => {
  await stopVNC()
  const status = await startVNC()
  return apiRes(res, { status }, 200)
})

AppRouter.post('/screencast/vnc/restart', vncRestart)
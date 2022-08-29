import type { Response, Request } from 'express'

import { statusVNC } from '@GSC/libs/vnc'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

export const vncStatus = asyncWrap(async (req:Request, res:Response) => {
  const status = await statusVNC()
  return apiRes(res, { status }, 200)
})

AppRouter.get('/screencast/vnc/status', vncStatus)
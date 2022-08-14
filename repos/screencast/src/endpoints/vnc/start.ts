import type { Response, Request } from 'express'

import { startVNC } from '@GSC/libs/vnc'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

export const vncStart = asyncWrap(async (req:Request, res:Response) => {
  const status = await startVNC()
  return apiRes(res, { status }, 200)
})

AppRouter.post('/screencast/vnc/start', vncStart)
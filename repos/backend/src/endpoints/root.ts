import type { Response, Request } from 'express'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'

export const apiRoot = async (req:Request, res:Response) => {
  return apiRes(
    res,
    {
      message: `GB Backend server is running`,
    },
    200
  )
}

AppRouter.get('/', apiRoot)
AppRouter.get('/health-check', apiRoot)


import type { Response, Request } from 'express'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

export const apiRoot = async (req:Request, res:Response) => {
  return apiRes(
    res,
    {
      message: `GB Kind server is running`,
    },
    200
  )
}

AsyncRouter.get('/', apiRoot)
AsyncRouter.get('/health-check', apiRoot)

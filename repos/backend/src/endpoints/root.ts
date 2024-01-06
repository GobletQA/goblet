import type { Response, Request } from 'express'
import { apiRes, AppRouter } from '@gobletqa/shared/api'


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


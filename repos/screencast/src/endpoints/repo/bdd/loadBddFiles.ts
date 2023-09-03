import type { Response, Request, RequestHandler } from 'express'

import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/api/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import { getFeatures } from '@gobletqa/workflows/repo/getFeatures'
import { fileModelArrayToObj } from '@gobletqa/shared/models/fileModelArrayToObj'

export const loadBddFiles:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  const { definitions, features } = await getFeatures(
    res.locals.repo,
    req.app.locals.config
  )

  return apiRes(
    res,
    {
      repo: res.locals.repo,
      features: fileModelArrayToObj(features),
      definitions: fileModelArrayToObj(definitions),
    },
    200
  )
})

AppRouter.get('/repo/:repo/bdd', loadBddFiles)
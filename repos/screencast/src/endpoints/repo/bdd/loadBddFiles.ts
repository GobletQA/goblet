import type { Response, Request } from 'express'

import { getFeatures } from '@gobletqa/repo/getFeatures'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import { fileModelArrayToObj } from '@gobletqa/shared/models/fileModelArrayToObj'

export const loadBddFiles = async (req:Request, res:Response) => {
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
}

AppRouter.get(`/repo/:repo/bdd`, loadBddFiles)
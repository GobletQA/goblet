import type { Response, Request } from 'express'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { getFeatures } from '@gobletqa/shared/repo/getFeatures'
import { fileModelArrayToObj } from '@gobletqa/shared/utils/fileModelArrayToObj'

export const loadBddFiles = asyncWrap(async (req:Request, res:Response) => {
  const { definitionTypes, definitions, features } = await getFeatures(
    res.locals.repo,
    req.app.locals.config
  )

  return apiRes(
    res,
    {
      definitionTypes,
      repo: res.locals.repo,
      features: fileModelArrayToObj(features),
      definitions: fileModelArrayToObj(definitions),
    },
    200
  )
})

AppRouter.get('/repo/:repo/bdd', loadBddFiles)
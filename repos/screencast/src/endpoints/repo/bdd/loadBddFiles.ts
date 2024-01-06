import type { Response, Request } from 'express'

import { getFeatures } from '@gobletqa/repo'
import { apiRes, AppRouter } from '@gobletqa/shared/api'
import { fileModelArrayToObj } from '@gobletqa/shared/fs'

export const loadBddFiles = async (req:Request, res:Response) => {
  const { definitions, features } = await getFeatures(res.locals.repo)

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
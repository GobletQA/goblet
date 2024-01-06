import type { Response, Request } from 'express'

import { apiRes, AppRouter } from '@gobletqa/shared/api'
import { loadDefinitions, fileModelArrayToObj } from '@gobletqa/shared/fs'


export const getDefinitions= async (req:Request, res:Response) => {
  const definitions = await loadDefinitions(res.locals.repo)

  return apiRes(res, { definitions: fileModelArrayToObj(definitions) }, 200)
}

AppRouter.get(`/repo/:repo/definitions`, getDefinitions)
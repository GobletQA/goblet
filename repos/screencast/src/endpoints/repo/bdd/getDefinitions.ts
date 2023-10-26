import type { Response, Request } from 'express'

import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import { loadDefinitions } from '@gobletqa/shared/libs/definitions/definitions'
import { fileModelArrayToObj } from '@gobletqa/shared/models/fileModelArrayToObj'

export const getDefinitions= async (req:Request, res:Response) => {
  const definitions = await loadDefinitions(res.locals.repo)

  return apiRes(res, { definitions: fileModelArrayToObj(definitions) }, 200)
}

AppRouter.get(`/repo/:repo/definitions`, getDefinitions)
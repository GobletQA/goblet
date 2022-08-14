import type { Response, Request } from 'express'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { definitionsByType } from '@gobletqa/shared/utils/definitionsByType'
import { loadDefinitions } from '@gobletqa/shared/libs/definitions/definitions'
import { fileModelArrayToObj } from '@gobletqa/shared/utils/fileModelArrayToObj'

export const getDefinitions = asyncWrap(async (req:Request, res:Response) => {
  const definitions = await loadDefinitions(
    res.locals.repo,
    req.app.locals.config
  )
  const definitionTypes = definitionsByType(definitions)

  return apiRes(
    res,
    {
      definitionTypes,
      definitions: fileModelArrayToObj(definitions),
    },
    200
  )
})

AppRouter.get('/repo/:repo/definitions', getDefinitions)
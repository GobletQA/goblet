import type { Response, Request, RequestHandler } from 'express'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { loadDefinitions } from '@gobletqa/shared/libs/definitions/definitions'
import { fileModelArrayToObj } from '@gobletqa/shared/models/fileModelArrayToObj'

export const getDefinitions:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  const definitions = await loadDefinitions(
    res.locals.repo,
    req.app.locals.config
  )

  return apiRes(res, { definitions: fileModelArrayToObj(definitions) }, 200)
})

AppRouter.get('/repo/:repo/definitions', getDefinitions)
import type { Response, Request } from 'express'
import type { TDefGobletConfig } from '@gobletqa/shared/types'

import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { getGobletDefaultFile } from '@gobletqa/shared/libs/fileSys/gobletFiles'

/**
 * Loads a file from within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the loaded fileModel
 */
export const loadGobletDefinition = asyncWrap(async (req:Request, res:Response) => {
  const filePath = req.query.path
  const config:TDefGobletConfig = req.app.locals.config
  
  const file = await getGobletDefaultFile(config, res.locals.repo, filePath as string)

  return apiRes(res, (file ? {file} : {}), 200)
})

AppRouter.get('/repo/:repo/goblet/files/definition', loadGobletDefinition)

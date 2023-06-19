import type { Response, Request, RequestHandler } from 'express'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { getGobletFile } from '@gobletqa/shared/libs/fileSys/gobletFiles'

/**
 * Loads a file from within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the loaded fileModel
 */
export const loadFile:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  const filePath = req.query.location
  const file = await getGobletFile(res.locals.repo, filePath as string)

  return apiRes(res, (file ? {file} : {}), 200)
})

AppRouter.get('/repo/:repo/files/load', loadFile)
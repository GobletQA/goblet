import type { Response, Request } from 'express'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { Exception } from '@gobletqa/shared/exceptions/Exception'
import { renameGobletFile } from '@gobletqa/shared/libs/fileSys/gobletFiles'

/**
 * Saves a file to a location within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the saved fileModel
 */
export const renameFile = asyncWrap(async (req:Request, res:Response) => {
  const {path:location, type} = req.body
  if (!location) throw new Exception(`[Backend API] Rename failed: location required`, 400)

  const meta = await renameGobletFile(res.locals.repo, location, type)

  return apiRes(res, meta || {}, 200)
})

AppRouter.post('/repo/:repo/files/rename', renameFile)
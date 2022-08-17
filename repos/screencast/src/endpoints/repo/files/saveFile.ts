import type { Response, Request } from 'express'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { saveGobletFile } from '@gobletqa/shared/libs/fileSys/gobletFiles'

/**
 * Saves a file to a location within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the saved fileModel
 */
export const saveFile = asyncWrap(async (req:Request, res:Response) => {
  const {path:location, content, type} = req.body
  if (!location) throw new Error(`[Backend API] Save failed: location required`)

  const meta = await saveGobletFile(res.locals.repo, location, content, type)

  return apiRes(res, meta || {}, 200)
})

AppRouter.post('/repo/:repo/files/save', saveFile)
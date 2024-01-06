import type { Response, Request } from 'express'

import { saveGobletFile } from '@gobletqa/shared/fs'
import { apiRes, AppRouter } from '@gobletqa/shared/api'

/**
 * Saves a file to a location within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the saved fileModel
 */
export const saveFile = async (req:Request, res:Response) => {
  const { location, content, type} = req.body
  if (!location) throw new Error(`[Backend API] Save failed: location required`)

  const meta = await saveGobletFile(res.locals.repo, location, content, type)

  return apiRes(res, meta || {}, 200)
}

AppRouter.post(`/repo/:repo/files/save`, saveFile)
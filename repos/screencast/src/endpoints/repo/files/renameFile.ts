import type { Response, Request } from 'express'

import { renameGobletFile } from '@gobletqa/shared/fs'
import { apiRes, AppRouter, Exception, } from '@gobletqa/shared/api'

/**
 * Saves a file to a location within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the saved fileModel
 */
export const renameFile = async (req:Request, res:Response) => {
  const {oldLoc, newLoc, content} = req.body

  if (!oldLoc) throw new Exception(`[Backend API] Rename failed: oldLoc required`, 400)
  if (!newLoc) throw new Exception(`[Backend API] Rename failed: newLoc required`, 400)

  const meta = await renameGobletFile(res.locals.repo, oldLoc, newLoc, content)

  return apiRes(res, meta || {}, 200)
}

AppRouter.post(`/repo/:repo/files/rename`, renameFile)
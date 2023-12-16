import type { Response, Request } from 'express'

import { getGobletFile } from '@gobletqa/shared/fs'
import { apiRes, AppRouter } from '@gobletqa/shared/api'

/**
 * Loads a file from within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the loaded fileModel
 */
export const loadFile = async (req:Request, res:Response) => {
  const filePath = req.query.location
  const file = await getGobletFile(res.locals.repo, filePath as string)

  return apiRes(res, (file ? {file} : {}), 200)
}

AppRouter.get(`/repo/:repo/files/load`, loadFile)
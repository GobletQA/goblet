import type { Response, Request } from 'express'

import { apiRes, AppRouter } from '@gobletqa/shared/api'
import { getGobletDefaultFile } from '@gobletqa/shared/fs'

/**
 * Loads a file from within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the loaded fileModel
 */
export const loadGobletDefinition = async (req:Request, res:Response) => {
  const filePath = req.query.location
  const file = await getGobletDefaultFile(res.locals.repo, filePath as string)

  return apiRes(res, (file ? {file} : {}), 200)
}

AppRouter.get(`/repo/:repo/goblet/files/definition`, loadGobletDefinition)

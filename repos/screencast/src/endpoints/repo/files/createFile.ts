import type { Response, Request } from 'express'

import { createGobletFile } from '@gobletqa/shared/fs'
import { apiRes, AppRouter } from '@gobletqa/shared/api'

/**
 * Creates new file based on file type within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the saved fileModel
 */
export const createFile = async (req:Request, res:Response) => {
  const { content, location, type } = req.body
  const meta = await createGobletFile(
    res.locals.repo,
    location,
    type,
    content,
  )

  return apiRes(res, meta, 200)
}

AppRouter.post(`/repo/:repo/files/create`, createFile)
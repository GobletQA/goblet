import type { Response, Request } from 'express'

import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import { createGobletFile } from '@gobletqa/shared/libs/fileSys/gobletFiles'

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
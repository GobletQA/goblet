import type { Response, Request } from 'express'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { createGobletFile } from '@gobletqa/shared/libs/fileSys/gobletFiles'

/**
 * Creates new file based on file type within the docker mounted test root folder
 *
 * @returns {Object} - response object model containing the saved fileModel
 */
export const createFile = asyncWrap(async (req:Request, res:Response) => {
  const { name, type } = req.body
  const meta = await createGobletFile(res.locals.repo, name, type)

  return apiRes(res, meta, 200)
})

AppRouter.post('/repo/:repo/files/create', createFile)
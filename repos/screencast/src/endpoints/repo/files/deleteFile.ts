import type { Response, Request } from 'express'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { deleteGobletFile } from '@gobletqa/shared/libs/fileSys/gobletFiles'

/**
 * Deletes an file located within the docker mounted test root folder
 *
 * @returns {Object} - response object model
 */
export const deleteFile = asyncWrap(async (req:Request, res:Response) => {
  const { file } = req.query
  const meta = await deleteGobletFile(res.locals.repo, file as string)

  return apiRes(res, meta || {}, 200)
})

AppRouter.delete('/repo/:repo/files/delete', deleteFile)
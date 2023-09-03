import type { Response, Request, RequestHandler } from 'express'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/api/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import { deleteGobletFile } from '@gobletqa/shared/libs/fileSys/gobletFiles'

/**
 * Deletes an file located within the docker mounted test root folder
 *
 * @returns {Object} - response object model
 */
export const deleteFile:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  const { location } = req.body
  const meta = await deleteGobletFile(res.locals.repo, location as string)

  return apiRes(res, meta || {}, 200)
})

AppRouter.delete('/repo/:repo/files/delete', deleteFile)
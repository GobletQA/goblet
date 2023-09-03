import type { Response, Request, RequestHandler } from 'express'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/api/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import { buildFileTree } from '@gobletqa/shared/libs/fileSys/fileTree'

/**
 * Iterates through the docker mounted volume of the test root folder
 * Returns a tree like structure of all the folders/files found within
 *
 * @returns {Object} - { rootPaths: array of root paths, nodes: array of all valid node object }
 */
export const getTree:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  const meta = await buildFileTree(res.locals.repo)
  return apiRes(res, meta || {}, 200)
})

AppRouter.get('/repo/:repo/files/tree', getTree)
import type { Response, Request } from 'express'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { buildFileTree } from '@gobletqa/shared/libs/fileSys/fileTree'

/**
 * Iterates through the docker mounted volume of the test root folder
 * Returns a tree like structure of all the folders/files found within
 *
 * @returns {Object} - { rootPaths: array of root paths, nodes: array of all valid node object }
 */
export const getTree = asyncWrap(async (req:Request, res:Response) => {
  const { nodes, rootPaths } = await buildFileTree(res.locals.repo)

  return apiRes(
    res,
    {
      nodes,
      rootPaths,
    } || {},
    200
  )
})

AppRouter.get('/repo/:repo/files/tree', getTree)
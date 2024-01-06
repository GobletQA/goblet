import type { Response, Request } from 'express'

import { buildFileTree } from '@gobletqa/shared/fs'
import { apiRes, AppRouter } from '@gobletqa/shared/api'

/**
 * Iterates through the docker mounted volume of the test root folder
 * Returns a tree like structure of all the folders/files found within
 *
 * @returns {Object} - { rootPaths: array of root paths, nodes: array of all valid node object }
 */
export const getTree = async (req:Request, res:Response) => {
  const meta = await buildFileTree(res.locals.repo)
  return apiRes(res, meta || {}, 200)
}

AppRouter.get(`/repo/:repo/files/tree`, getTree)
import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'

import { Repo } from '@gobletqa/shared/repo/repo'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { Exception } from '@gobletqa/shared/exceptions/Exception'
import { loadRepoContent } from '@gobletqa/shared/repo/loadRepoContent'

/**
 * Gets the status of a connected repo
 * Calls the statusGoblet workflow
 */
export const statusRepo = asyncWrap(async (req:JWTRequest, res:Response) => {

  const { query } = req
  const { token, username, provider } = req.auth
  const { config } = req.app.locals
  const { repo, status } = await Repo.status(config, {
    token,
    provider,
    username,
    ...query,
  })

  // If not mounted, return the unmounted status, so the ui can update base on the mode
  // In local mode, it just shows the editor
  // In VNC mode, it shows the git modal to connect a repo
  if (!status.mounted) return apiRes(res, { status })

  // If we get here only if repo exists on res.locals or status.repo
  const foundRepo = repo || res.locals.repo

  // Extra check just incase we missed something
  if (!foundRepo)
    throw new Exception(`Error getting repo status. No repo exists.`, 422)

  const repoContent = await loadRepoContent(foundRepo, config, status)

  return apiRes(res, repoContent)
})


AppRouter.get(`/repo/status`, statusRepo)
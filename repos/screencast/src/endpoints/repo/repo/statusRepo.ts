import type { Response } from 'express'
import type { TGitOpts } from '@gobletqa/workflows'
import type { Request as JWTRequest } from 'express-jwt'

import { workflows } from '@gobletqa/workflows'
import { loadRepoContent } from '@gobletqa/repo'
import { setBrowserDefaults } from '@gobletqa/browser'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import { Exception } from '@gobletqa/shared/exceptions/Exception'

/**
 * Gets the status of a connected repo
 * Calls the statusGoblet workflow
 */
export const statusRepo = async (req:JWTRequest, res:Response) => {

  const { query } = req
  const { token, username, provider } = req.auth
  const { config } = req.app.locals
  const { repo, status } = await workflows.status(config, {
    token,
    provider,
    username,
    ...query,
  } as TGitOpts)

  // If not mounted, return the unmounted status, so the ui can update base on the mode
  // In local mode, it just shows the editor
  // In VNC mode, it shows the git modal to connect a repo
  if (!status.mounted) return apiRes(res, { status })

  // If we get here only if repo exists on res.locals or status.repo
  const foundRepo = repo || res.locals.repo

  // Extra check just incase we missed something
  if (!foundRepo)
    throw new Exception(`Error getting repo status. No repo exists.`, 422)

  const repoContent = await loadRepoContent(foundRepo, status)
  try {
    await setBrowserDefaults({
      repo: foundRepo,
      config: foundRepo,
      browserConf: joinBrowserConf(foundRepo?.screencast?.browser)
    })
  }
  catch(err){
    repoContent.warning = { message: err.message, type: `BROWSER_DEFAULTS` }
  }

  return apiRes(res, repoContent)
}


AppRouter.get(`/repo/status`, statusRepo)
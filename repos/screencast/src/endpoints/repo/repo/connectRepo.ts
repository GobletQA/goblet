import { Request, Response } from 'express'
import { Repo } from '@gobletqa/shared/repo/repo'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { loadRepoContent } from '@gobletqa/shared/repo/loadRepoContent'

/**
 * Runs the initializeGoblet workflow to setup a new repository
 */
export const connectRepo = asyncWrap(async (req:Request, res:Response) => {
  // @ts-ignore
  const { iat, exp, ...user } = req.user

  // TODO: Add req.body / req.user validation before running
  const repo = await Repo.fromWorkflow({
    ...user,
    ...req.body,
  })

  const { config } = req.app.locals
  const content = await loadRepoContent(repo, config)

  // TODO: update to not include repo.parkin to the frontend  
  return apiRes(res, content, 200)
})

AppRouter.post('/repo/connect', connectRepo)
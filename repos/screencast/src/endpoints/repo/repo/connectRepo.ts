import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import type { TRepoContent } from '@gobletqa/shared/types'

import { Repo } from '@gobletqa/shared/repo/repo'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { loadRepoContent } from '@gobletqa/shared/repo/loadRepoContent'


export type TConnectBody = {
  repoId:string
  repoUrl:string
  branch:string
  newBranch:string
  branchFrom?:boolean
}

/**
 * Runs the initializeGoblet workflow to setup a new repository
 */
export const connectRepo = asyncWrap(async (
  req:JWTRequest,
  res:Response
) => {
  let content:TRepoContent
  try {

    const body = req.body as TConnectBody
    const { token, username } = req.auth
    const { repo, status } = await Repo.fromWorkflow({
      token,
      username,
      ...body,
    })

    const { config } = req.app.locals
    content = await loadRepoContent(repo, config, status)
  }
  catch(err){
    // If the repo mounting fails for some reason
    // Call disconnect incase it throws after the repo was mounted
    await Repo.disconnect({ username: req.auth.username })
    throw err
  }

  return apiRes(res, content, 200)
})

AppRouter.post('/repo/connect', connectRepo)
import type { Response, RequestHandler } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import type { TRepoContent } from '@gobletqa/shared/types'

import { apiRes } from '@gobletqa/shared/express/apiRes'
import { Repo, loadRepoContent } from '@gobletqa/workflows'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/express/appRouter'


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
export const connectRepo:RequestHandler = asyncWrap(async (
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
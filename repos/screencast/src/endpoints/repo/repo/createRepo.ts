import type { RequestHandler, Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import type { TRepoContent } from '@gobletqa/shared/types'

import { Logger } from '@GSC/utils/logger'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { Repo, loadRepoContent } from '@gobletqa/workflows'
import { asyncWrap } from '@gobletqa/shared/api/express/asyncWrap'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'


export type TCreateBody = {
  name:string
  branch:string
  newBranch:string
  branchFrom?:boolean
  description?:string
  organization?:string
}

/**
 * Runs the initializeGoblet workflow to setup a new repository
 */
export const createRepo:RequestHandler = asyncWrap(async (
  req:JWTRequest,
  res:Response
) => {
  let content:TRepoContent
  try {

    const body = req.body as TCreateBody
    const { token, username, provider } = req.auth
    const { repo, status } = await Repo.create({
      token,
      provider,
      username,
      ...body,
    })

    const { config } = req.app.locals
    content = await loadRepoContent(repo, config, status)
  }
  catch(err){
    const { config } = req.app.locals

    // If the repo mounting fails for some reason
    // Call disconnect incase it throws after the repo was mounted
    config?.server?.environment !== `local`
      ? await Repo.disconnect({ username: req.auth.username })
      : Logger.warn(`Skipping repo unmount in local environment`)

    throw err
  }

  return apiRes(res, content, 200)
})

AppRouter.post('/repo/create', createRepo)
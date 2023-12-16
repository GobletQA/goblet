import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import type { TRepoContent } from '@gobletqa/shared/types'

import { Logger } from '@GSC/utils/logger'
import { Workflows } from '@gobletqa/workflows'
import { loadRepoContent } from '@gobletqa/repo'
import { apiRes, AppRouter } from '@gobletqa/shared/api'


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
export const createRepo = async (
  req:JWTRequest,
  res:Response
) => {
  let content:TRepoContent
  const workflows = new Workflows()

  try {

    const body = req.body as TCreateBody
    const { token, username, provider } = req.auth
    const { repo, status } = await workflows.create({
      token,
      provider,
      username,
      ...body,
    })

    content = await loadRepoContent(repo, status)
  }
  catch(err){
    const { config } = req.app.locals

    // If the repo mounting fails for some reason
    // Call disconnect incase it throws after the repo was mounted
    config?.server?.environment !== `local`
      ? await workflows.disconnect({ username: req.auth.username })
      : Logger.warn(`Skipping repo unmount in local environment`)

    throw err
  }

  return apiRes(res, content, 200)
}

AppRouter.post(`/repo/create`, createRepo)
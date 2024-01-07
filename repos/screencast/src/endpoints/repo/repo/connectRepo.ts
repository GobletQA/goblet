import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import type { TRepoContent } from '@gobletqa/shared/types'

import { Logger } from '@GSC/utils/logger'
import { workflows } from '@gobletqa/workflows'
import { loadRepoContent } from '@gobletqa/repo'
import { apiRes, AppRouter } from '@gobletqa/shared/api'


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
export const connectRepo = async (
  req:JWTRequest,
  res:Response
) => {
  let content:TRepoContent
  let repo:any
  let status:any

  try {

    const body = req.body as TConnectBody
    const { token, username } = req.auth

    // Ensure all cache is cleared for the user
    workflows.resetCache(username)

    const resp = await workflows.fromWorkflow({
      token,
      username,
      ...body,
    })
    repo = resp.repo
    status = resp.status


    content = await loadRepoContent(repo, status)
  }
  catch(err){

    Logger.error(err)
    Logger.log(`Repo:`, repo)
    Logger.log(`status:`, status)

    // If the repo mounting fails for some reason
    // Call disconnect incase it throws after the repo was mounted
    await workflows.disconnect({ username: req.auth.username })
    throw err
  }


  return apiRes(res, content, 200)
}

AppRouter.post(`/repo/connect`, connectRepo)
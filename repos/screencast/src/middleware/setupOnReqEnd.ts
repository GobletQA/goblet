import type { Repo } from '@gobletqa/shared/types'
import type { Response, NextFunction } from 'express'
import type { Request as JWTRequest } from 'express-jwt'

import onFinished from 'on-finished'
import { Logger } from '@GSC/utils/logger'
import { workflows } from '@gobletqa/workflows'
import { AppRouter } from '@gobletqa/shared/api'
import {
  loadDefinitions,
  removeRepoCacheDefs
} from '@gobletqa/shared/fs'

const onReqEnd = (error:Error, res:Response, next:NextFunction) => {
  if(error) return

  if(res.req.method !== `POST`) return

  Logger.info(`Checking for modified repo step definition...`)
  const repo = res?.locals?.repo as Repo
  const location = res.req?.body?.location
  const { stepsDir, repoRoot } = (repo?.paths || {})

  const isStepDef = location
    && stepsDir
    && repoRoot
    && location.startsWith(repoRoot)
    && location.includes(stepsDir)
  
  if(!isStepDef) return

  Logger.info(`Found modified step definition, updating step definition cache...`)
  removeRepoCacheDefs()

  Logger.info(`Reloading steps into repo...`)
  loadDefinitions(repo, false)

  Logger.info(`Updating workflow cache with updated repo...`)
  workflows.updateCache(repo.git.username, { repo })

}

export const setupOnReqEnd = () => {
  AppRouter.use(`/repo/:repo/files/*`, (req:JWTRequest, res:Response, next:NextFunction) => {
    onFinished(res, onReqEnd)
    next()
  })
}
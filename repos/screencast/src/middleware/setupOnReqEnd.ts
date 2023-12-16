import type { Repo } from '@gobletqa/shared/types'
import type { Response, NextFunction } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import onFinished from 'on-finished'

import { AppRouter } from '@gobletqa/shared/api'
import {
  loadDefinitions,
  removeRepoCacheDefs
} from '@gobletqa/shared/fs'

const onReqEnd = (error:Error, res:Response, next:NextFunction) => {
  if(error) return

  if(res.req.method !== `POST`) return

  const repo = res?.locals?.repo as Repo
  const location = res.req?.body?.location
  const { stepsDir, repoRoot } = (repo?.paths || {})

  const isStepDef = location
    && stepsDir
    && repoRoot
    && location.startsWith(repoRoot)
    && location.includes(stepsDir)
  
  if(!isStepDef) return

  removeRepoCacheDefs()
  loadDefinitions(repo, false)

}

export const setupOnReqEnd = () => {
  AppRouter.use(`/repo/:repo/files/*`, (req:JWTRequest, res:Response, next:NextFunction) => {
    onFinished(res, onReqEnd)
    next()
  })
}
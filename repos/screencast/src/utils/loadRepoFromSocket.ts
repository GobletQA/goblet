import type { Express } from 'express'
import type { TGitData, TGitOpts } from '@gobletqa/git'

import type {
  TTokenUser,
} from '@GSC/types'


import { getApp } from '@gobletqa/shared/api'
import { workflows } from '@gobletqa/workflows'
import { pickKeys } from '@keg-hub/jsutils/pickKeys'

export type TLoadRepoFromSocket = {
  app?:Express
  repo:TGitData
  user:TTokenUser
}

/**
 * Loads a Repo class instance for the request
 * Ensures valid meta-data was passed with the request via the JWT
 * Otherwise throws an error
 */
export const loadRepoFromSocket = async (args:TLoadRepoFromSocket) => {
  const { user, repo:gitData } = args

  const app = args.app || getApp()
  if(!app) throw new Error(`Application not found, request could not be completed`)

  if (!gitData || !gitData?.local)
    throw new Error(`Endpoint requires a locally mounted path, I.E. /repos/:repo-name/*`)

  if(!user || !user.token || !user.provider)
    throw new Error(`User not authenticated, request can not be completed`)

  const opts = {
    ...pickKeys<Partial<TGitOpts>>(gitData, [
      `name`,
      `local`,
      `remote`,
      `repoId`,
      `branch`,
      `repoName`,
      `username`,
    ]),
    ...pickKeys<Partial<TGitOpts>>(user, [`token`, `provider`, `username`]),
  } as TGitOpts

  if(!opts.username)
    opts.username = user.username || gitData.username

  const { repo } = await workflows.status(app.locals.config, opts)

  if (!repo) throw new Error(`Requested repo could not be initialized`)

  return { repo }
}

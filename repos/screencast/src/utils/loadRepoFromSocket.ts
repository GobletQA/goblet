import type { Express } from 'express'
import type {
  TGitData,
  TTokenUser,
} from '@GSC/types'


import { workflows } from '@gobletqa/workflows'
import { pickKeys } from '@keg-hub/jsutils/pickKeys'
import { getApp } from '@gobletqa/shared/api/express/app'

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

    const { repo } = await workflows.status(app.locals.config, {
      ...pickKeys(gitData, [
        `name`,
        `local`,
        `remote`,
        `repoId`,
        `branch`,
        `repoName`,
        `username`,
      ]),
      ...pickKeys(user, [`token`, `provider`]),
    })

  if (!repo) throw new Error(`Requested repo could not be initialized`)

  await repo.refreshWorld()

  return { repo }
}


import type { TApiRepoResp } from '@types'

import { repoDispatch } from '@reducers'
import { setFileTypeConstants } from '@constants/types'
import { upsertFeatures } from '@actions/features/local'
import { upsertDefinitions } from '@actions/definitions/local'
import { setFileTree } from '@actions/files/local/setFileTree'

/**
 * Updates the store with any repo / file content that exists in the passed in params
 * Used by repo/api/connect && repo/api/status actions
 *
 */
export const setRepo = (params:TApiRepoResp) => {
  const {
    repo,
    fileTree,
    features,
    definitions,
    definitionTypes
  } = params

  repo.fileTypes &&
    setFileTypeConstants(
      Object.keys(repo.fileTypes)
      .reduce((acc, type) => {
        acc[type.toUpperCase()] = type

        return acc
      }, {} as Record<string, string>)
    )

  repo && repoDispatch.setRepo(repo)

  features && upsertFeatures(features)

  definitions &&
    definitionTypes &&
    upsertDefinitions(definitions, definitionTypes)

  fileTree && setFileTree(fileTree)
}

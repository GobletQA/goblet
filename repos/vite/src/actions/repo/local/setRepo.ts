import type { TRepoState, TApiRepoResp } from '@types'

import { repoDispatch } from '@store'
import { localStorage } from '@services/localStorage'
import { setFileTypeConstants } from '@constants/types'
import { upsertFeatures } from '@actions/features/local'
import { upsertDefinitions } from '@actions/definitions/local'
import { setFileTree } from '@actions/files/local/setFileTree'

/**
 * Helper to update the local repo state returned from teh backend
 */
const setRepoData = async (repo:TRepoState) => {
  repo.fileTypes &&
    setFileTypeConstants(
      Object.keys(repo.fileTypes)
      .reduce((acc, type) => {
        acc[type.toUpperCase()] = type

        return acc
      }, {} as Record<string, string>)
    )

  await localStorage.setRepo(repo)
  repoDispatch.setRepo(repo)
}

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
  } = params

  repo && setRepoData(repo)
  features && upsertFeatures(features)
  definitions && upsertDefinitions(definitions)
  fileTree && setFileTree(fileTree)
}

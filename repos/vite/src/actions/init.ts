import type { TRouteMeta } from '@types'

import { ModalTypes } from '@constants'
import { isEmptyColl } from '@keg-hub/jsutils'
import { loadFile } from './files/api/loadFile'
import { statusRepo } from '@actions/repo/api/status'
import { getQueryData } from '@utils/url/getQueryData'
import { loadUser } from '@actions/admin/user/loadUser'
import { statusContainer } from '@actions/container/api'
import { setActiveModal } from '@actions/modals/setActiveModal'

/**
 * Checks if an initial test file should be loaded, and makes call to load it
 */
const loadInitRepoFiles = async (
  queryObj:Record<any, any>,
  mergeQuery: boolean
) => {
  // Load the initial file from query params if it exists
  queryObj?.file && (await loadFile(queryObj?.file, mergeQuery))
}

/**
 * Checks if the initial settings modal should be shown, and makes call to update the store
 */
const loadInitModal = (queryObj:Record<any, any>) => {
  ;(!queryObj || !queryObj?.file || isEmptyColl(queryObj)) &&
    setActiveModal(ModalTypes.REPO)
}

export const initStatus = async (status?:TRouteMeta) => {
  // If user is logged in, check the status of users session container
  // If not logged in the status should come as an argument from the onSuccessAuth method
  status = status || await statusContainer()

  // Will allow using goblet without persisting changes
  const repoStatus = await statusRepo({ routes: status?.routes })

  if (!repoStatus || !repoStatus.mounted) return

  // Finally if the repo is mounted
  // Then get the query data to route to the correct tab as needed
  const queryObj = getQueryData()

  // Load the initial test file
  await loadInitRepoFiles(queryObj, true)

  // Load the init modal
  loadInitModal(queryObj)
}

export const initApp = async () => {
  // Load the local storage user if they exist
  const activeUser = await loadUser()

  return !activeUser
    ? setActiveModal(ModalTypes.SignIn)
    : initStatus()
}

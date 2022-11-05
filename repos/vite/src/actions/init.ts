import type { TRouteMeta } from '@types'

import { loadFile } from './files/api/loadFile'
import { signInModal } from '@actions/modals/modals'
import { statusRepo } from '@actions/repo/api/status'
import { getQueryData } from '@utils/url/getQueryData'
import { loadUser } from '@actions/admin/user/loadUser'
import { statusContainer } from '@actions/container/api'

export const initStatus = async (status?:TRouteMeta) => {
  // If user is logged in, check the status of users session container
  // If not logged in the status should come as an argument from the onSuccessAuth method
  status = status || await statusContainer()

  // Will allow using goblet without persisting changes
  const repoStatus = await statusRepo({ routes: status?.routes })

  if (!repoStatus || !repoStatus.mounted) return

  // Finally if the repo is mounted
  // Then get the query data to route to the correct tab as needed
  const queryObj = getQueryData() as Record<string, any>

  // Load the initial file from query params if it exists
  queryObj?.file && (await loadFile(queryObj?.file))
}

export const initApp = async () => {
  // Load the local storage user if they exist
  const activeUser = await loadUser()

  return !activeUser ? signInModal() : initStatus()
}

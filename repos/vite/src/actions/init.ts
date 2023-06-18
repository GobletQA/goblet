import type { TStatusRoutes } from '@types'

import { loadFile } from './files/api/loadFile'
import { emptyObj, isObj } from '@keg-hub/jsutils'
import { signInModal } from '@actions/modals/modals'
import { statusRepo } from '@actions/repo/api/status'
import { getQueryData } from '@utils/url/getQueryData'
import { loadUser } from '@actions/admin/user/loadUser'
import { statusContainer } from '@actions/container/api'
import { loadFromStorage } from './settings/loadFromStorage'

export type TInitStatus = {
  fromIdle?:boolean
  params?:Record<string, any>
}

export const initStatus = async (props:TInitStatus=emptyObj) => {
  // If user is logged in, check the status of users session container
  // If not logged in the status should come as an argument from the onSuccessAuth method
  const resp = await statusContainer(props)

  if(resp instanceof Error) throw resp

  // Will allow using goblet without persisting changes
  const repoStatus = await statusRepo(isObj<Record<`routes`, TStatusRoutes>>(resp)? resp : emptyObj)

  if(repoStatus instanceof Error) throw repoStatus

  if (!repoStatus || !repoStatus.mounted) return

  // Finally if the repo is mounted
  // Then get the query data to route to the correct tab as needed
  const queryObj = getQueryData() as Record<string, any>

  // Load the initial file from query params if it exists
  queryObj?.file && (await loadFile(queryObj?.file))
}

export const initApp = async () => {
  // Load the users settings from local storage
  await loadFromStorage()

  // Load the local storage user if they exist
  const activeUser = await loadUser()

  return !activeUser ? signInModal() : initStatus()
}

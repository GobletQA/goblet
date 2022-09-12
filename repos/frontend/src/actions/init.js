import { Values } from 'GBConstants'
import { isEmptyColl } from '@keg-hub/jsutils'
import { loadFile } from './files/api/loadFile'
import { setActiveModal } from 'GBActions/modals'
import { isAuthActive } from 'GBUtils/isAuthActive'
import { setActiveSidebar } from 'GBActions/sidebar'
import { statusRepo } from 'GBActions/repo/api/status'
import { getQueryData } from 'GBUtils/url/getQueryData'
import { loadUser } from 'GBActions/admin/user/loadUser'
import { setScreenById } from 'GBActions/screens/setScreenById'
import { statusContainer } from 'GBActions/container/api'

const { MODAL_TYPES, SIDEBAR_TYPES, SCREENS } = Values
const authActive = isAuthActive()

/**
 * Checks if an initial test file should be loaded, and makes call to load it
 * @function
 * @param {Object} queryObj - Current url query params as an object
 * @param {string} screenId - Id of the screen to load the file for
 * @param {boolean} mergeQuery - Merge the current url query string with the updated file
 *
 * @return {void}
 */
const loadInitTestFiles = async (queryObj, screenId, mergeQuery) => {
  // Load the initial file from query params if it exists
  queryObj?.file && (await loadFile(queryObj?.file, screenId, mergeQuery))
}

/**
 * Checks if the initial settings modal should be shown, and makes call to update the store
 * @function
 * @param {Object} queryObj - Current url query params as an object
 *
 * @return {void}
 */
const loadInitModal = queryObj => {
  ;(!queryObj || isEmptyColl(queryObj) || !queryObj?.file) &&
    setActiveModal(MODAL_TYPES.TEST_SELECTOR)
}

/**
 * Init action
 * executes on first app load
 * @function
 */
export const init = async () => {
  // Load the local storage user if they exist
  const activeUser = await loadUser()

  // First ensure the user is logged in
  // Otherwise, show login modal and return
  if(!activeUser && authActive)
    return setActiveModal(MODAL_TYPES.SIGN_IN)

  // If user is logged in,
  // Next check the status of users session container
  const status = await statusContainer()



  // Will allow using goblet without persisting changes
  const repoStatus = await statusRepo({ routes: status?.routes })
  if (!repoStatus || !repoStatus.mounted) return

  // Finally if the repo is mounted
  // Then get the query data to route to the correct tab as needed
  const queryObj = getQueryData()

  // Load the initial screen
  const screenId = queryObj.screen || SCREENS.EDITOR
  setScreenById(screenId)

  // Load the initial test file
  await loadInitTestFiles(queryObj, screenId, Boolean(screenId))

  // Setup the sidebar
  setActiveSidebar(SIDEBAR_TYPES.FILE_TREE)

  // Load the init modal
  loadInitModal(queryObj)
}

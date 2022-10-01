import { ModalTypes } from '@constants'
import { getQueryData } from './getQueryData'
import { isEmptyColl, noOpObj } from '@keg-hub/jsutils'
import { loadFile } from '@actions/files/api/loadFile'
import { setActiveModal } from '@actions/modals/setActiveModal'

// TODO: figure out what to do with screens
// import { setScreenById } from '@actions/screens/setScreenById'


/**
 * The current popstate
 * @boolean
 */
let IN_POP_STATE = false

/**
 * Handler for window.popstate events
 * Updates the redux store based on the updated url params
 * @function
 * @public
 * @export
 * @param {Object} event - Window pop state event
 *
 * @return {void}
 */
const listenToPopState = async (event:any) => {
  IN_POP_STATE = true
  // Get the query params from the url
  const queryObj = getQueryData() || noOpObj

  const { screen, file } = queryObj as Record<string, string>

  // screen && setScreenById(screen)
  file && (await loadFile(file, screen))

  // Load the init modal
  // display options modal if no valid querystring passed in
  isEmptyColl(queryObj) && setActiveModal(ModalTypes.REPO)

  IN_POP_STATE = false
}

window.addEventListener('popstate', listenToPopState)

/**
 * Helper to know when the updates are coming form a pop-state update
 * @function
 * @public
 * @export
 *
 * @return {boolean} - The current popstate
 */
export const inPopStateUpdate = () => IN_POP_STATE

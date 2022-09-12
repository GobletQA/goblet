import { getStore } from 'GBStore'
import { Values } from 'GBConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from 'GBActions/toasts'
import { apiRequest } from 'GBUtils/api/apiRequest'
import { setSCStatus } from 'GBActions/screencast/local/setSCStatus'

const { HttpMethods, CATEGORIES } = Values

/**
 * Calls the backend API to get the status of the screencast processes
 * Updates the store with the response
 *
 * @returns {Object} - Response from the backend API
 */
export const getSCStatus = async (options = noOpObj) => {
  const { items } = getStore()?.getState()
  if (!items) return console.warn(`No items set in the store`)

  const browserOpts = items[CATEGORIES.BROWSER_OPTS]

  const {
    data,
    error,
    success
  } = await apiRequest({
    url: '/screencast/status',
    method: HttpMethods.GET,
    params: {
      browser: {
        ...browserOpts,
        ...options.browser,
      },
    },
  })

  !success || error
    ? addToast({
        type: 'error',
        message: error || `Failed to get screencast status`
      })
    : data && setSCStatus(data)

  return data
}

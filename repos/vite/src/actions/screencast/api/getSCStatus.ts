import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from '@actions/toasts'
import { screencastApi } from '@services/screencastApi'
import { getSettingsValues } from '@utils/settings/getSettingsValues'
import { setSCStatus } from '@actions/screencast/local/setSCStatus'

/**
 * Calls the backend API to get the status of the screencast processes
 * Updates the store with the response
 *
 * @returns {Object} - Response from the backend API
 */
export const getSCStatus = async (options:Record<any, any> = noOpObj) => {
  const browserOpts = getSettingsValues(`browser`)

  const {
    data,
    error,
    success
  } = await screencastApi.serviceStatus({
    browser: {
      ...browserOpts,
      ...options.browser,
      addAutomate: true,
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

import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from '@actions/toasts'
import { screencastApi } from '@services/screencastApi'
import { setBrowserStatus } from '../local/setBrowserStatus'
import { getSettingsValues } from '@utils/settings/getSettingsValues'

/**
 * Calls the backend API to get the browser status
 * Then calls setBrowser status with the response
 * @param {Object} options - Custom options to pass to the backend API
 *
 * @return {Object} - Backend API response
 */
export const statusBrowser = async (options = noOpObj) => {
  const browserOpts = getSettingsValues(`browser`)

  const {
    data,
    error,
    success
  } = await screencastApi.status({
    ...browserOpts,
    ...options,
  })

  !success || error
    ? addToast({
        type: 'error',
        message: error || `Failed to get the browser status, please try again later`
      })
    : data && setBrowserStatus(data)

  return data
}

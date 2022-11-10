import { HttpMethods } from '@constants'
import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from '@actions/toasts'
import { apiRequest } from '@utils/api/apiRequest'
import { getSettingsValues } from '@utils/store/getSettingsValues'

/**
 * Makes API call to restart the Playwright browser for VNC playback
 * If screen is not screencast, then the browser restart is skipped
 *
 */
export const restartBrowser = async (options:Record<any, any> = noOpObj) => {
  const browserOpts = getSettingsValues(`browser`)

  const {
    data,
    error,
    success
  } = await apiRequest({
    url: '/screencast/browser/restart',
    method: HttpMethods.POST,
    params: {
      ...browserOpts,
      ...options,
    },
  })

  if(!success || error)
    addToast({
      type: 'error',
      message: error || `Failed to restart the browser, please try again later.`,
    })

  // TODO: store browser running status in redux
  // Then use that to tell update the canvas to reload as needed
  return data
}

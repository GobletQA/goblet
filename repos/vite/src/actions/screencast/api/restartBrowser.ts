import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from '@actions/toasts'
import { screencastApi } from '@services/screencastApi'
import { getSettingsValues } from '@utils/settings/getSettingsValues'

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
  } = await screencastApi.restart({
    ...browserOpts,
    ...options,
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

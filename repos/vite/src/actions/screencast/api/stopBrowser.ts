import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from '@actions/toasts'
import { screencastApi } from '@services/screencastApi'
import { getSettingsValues } from '@utils/settings/getSettingsValues'

export const stopBrowser = async (options = noOpObj) => {

  const browserOpts = getSettingsValues(`browser`)

  const {
    data,
    error,
    success
  } = await screencastApi.stop({
    ...browserOpts,
    ...options,
  })


  if(!success || error)
    addToast({
      type: `error`,
      message: error || `Failed to stop the browser, please try again later`
    })

  return data
}

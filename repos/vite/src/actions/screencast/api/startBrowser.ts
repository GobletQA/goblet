import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from '@actions/toasts'
import { screencastApi } from '@services/screencastApi'
import { getSettingsValues } from '@utils/store/getSettingsValues'

export const startBrowser = async (options = noOpObj) => {
  const browserOpts = getSettingsValues(`browser`)

  
  const {
    data,
    error,
    success
  } = await screencastApi.start({ ...browserOpts, ...options })

  if(!success || error)
    addToast({
      type: 'error',
      message: error || `Failed to start the browser, please try again later.`,
    })
  
  // TODO: store browser running status in redux
  // Then use that to tell update the canvas to reload as needed
  console.log(`---------- data ----------`)
  console.log(data)

  return data
}

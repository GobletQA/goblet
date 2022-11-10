import { HttpMethods } from '@constants'
import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from '@actions/toasts'
import { apiRequest } from '@utils/api/apiRequest'
import { screencastApi } from '@services/screencastApi'
import { getSettingsValues } from '@utils/store/getSettingsValues'

export const stopBrowser = async (options = noOpObj) => {

  const browserOpts = getSettingsValues(`browser`)

  const {
    data,
    error,
    success
  } = await screencastApi.stop({ ...browserOpts, ...options })


  if(!success || error)
    addToast({
      type: 'error',
      message: error || `Failed to stop the browser, please try again later`
    })

  // TODO: Update setBrowserStatus to handle browser status of stopped
  // data && setBrowserStatus(data)
  
  console.log(`---------- data ----------`)
  console.log(data)

  return data
}

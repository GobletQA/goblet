import { HttpMethods } from '@constants'
import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from '@actions/toasts'
import { apiRequest } from '@utils/api/apiRequest'
import { getSettingsValues } from '@utils/store/getSettingsValues'

export const startBrowser = async (options = noOpObj) => {
  const browserOpts = getSettingsValues(`browser`)

  const {
    data,
    error,
    success
  } = await apiRequest({
    url: '/screencast/browser/start',
    method: HttpMethods.GET,
    params: { ...browserOpts, ...options },
  })

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

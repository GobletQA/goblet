import { getStore } from 'GBStore'
import { Values } from 'GBConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from 'GBActions/toasts'
import { apiRequest } from 'GBUtils/api/apiRequest'

const { HttpMethods, CATEGORIES } = Values

export const startBrowser = async (options = noOpObj) => {
  const { items } = getStore()?.getState()
  if (!items) return console.warn(`No items set in the store`)

  const storeOpts = items[CATEGORIES.BROWSER_OPTS]

  addToast({
    type: 'info',
    message: `Starting Browser...`,
  })

  const {
    data,
    error,
    success
  } = await apiRequest({
    url: '/screencast/browser/start',
    method: HttpMethods.GET,
    params: { ...storeOpts, ...options },
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

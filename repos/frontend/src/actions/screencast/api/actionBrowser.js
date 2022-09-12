import { Values } from 'GBConstants'
import { addToast } from 'GBActions/toasts'
import { apiRequest } from 'GBUtils/api/apiRequest'
const { HttpMethods } = Values

export const actionBrowser = async (props, log=true) => {
  const {
    data,
    error,
    success
  } = await apiRequest({
    url: '/screencast/browser/action',
    method: HttpMethods.POST,
    params: props,
  })

  if(!success || error)
    return addToast({
      type: 'error',
      message: error || `Browser action failed to run`
    })
  
  log && addToast({
    type: 'success',
    message: `Browser action ran successfully`
  })

}

import { HttpMethods } from '@constants'
import { addToast } from '@actions/toasts'
import { apiRequest } from '@utils/api/apiRequest'

export const actionBrowser = async (props:Record<any, any>, log=true) => {
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

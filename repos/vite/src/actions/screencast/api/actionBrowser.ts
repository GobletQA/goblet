import { addToast } from '@actions/toasts'
import { screencastApi } from '@services/screencastApi'

export const actionBrowser = async (props:Record<any, any>, log=true) => {
  const {
    data,
    error,
    success
  } = await screencastApi.action(props)

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

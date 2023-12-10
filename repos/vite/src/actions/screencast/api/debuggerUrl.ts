import { addToast } from '@actions/toasts'
import { screencastApi } from '@services/screencastApi'

export const debuggerUrl = async () => {
  const {
    data,
    error,
    success
  } = await screencastApi.debugger()

  if(!success || error)
    addToast({
      type: 'error',
      message: error || `Failed to get debugger configuration`
    })


  return { data, error }
}
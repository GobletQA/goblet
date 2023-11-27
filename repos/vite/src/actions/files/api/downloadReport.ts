import { filesApi } from '@services/filesApi'
import { addToast } from '@actions/toasts/addToast'

export const downloadReport = async (location:string) => {
  const { success, error } = await filesApi.downloadReport({ location })

  if (!success || error)
    return addToast({
      type: `error`,
      message: error || `Error download Test Report, please try again later.`,
    })

  return success
}
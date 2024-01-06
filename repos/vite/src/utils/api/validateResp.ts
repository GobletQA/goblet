import type { TValidateResp } from '@types'
import type { TResponse } from '@services/axios.types'
import { Exception } from '@services/sharedService'


/**
 * Validate the response from the Backend API
 * Ensure we have all the correct Provider user metadata
 */
export const validateResp = async (resp:TResponse<TValidateResp>, refreshValidate?:boolean) => {
  const {
    data,
    error,
    success,
    statusCode,
  } = resp
  
  if(error || !success)
    throw new Exception(
      error || `[Auth State Error] Could not validate user. Please try agin later.`,
      statusCode
    )

  else if (!data || data?.error || !data?.username || (!data?.id && !data.userId) || !data?.provider || !data?.jwt){
    error && console.error(error)
    data?.error && console.error(data?.error)
    throw new Exception(`[Auth State Error] Could not validate user. Please try agin later.`, 401)
  }

  const { jwt, status, ...user } = data

  return {
    jwt,
    user,
    status,
  }
}

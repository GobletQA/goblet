import {
  GB_APPWRITE_AUTH_FAIL,
  GB_APPWRITE_AUTH_PARAM,
  GB_APPWRITE_AUTH_SUCCESS
} from '@constants/appwrite'

export const generateAuthUrls = () => {
  const location = new URL(window.location.toString())

  location.search = `${GB_APPWRITE_AUTH_PARAM}=${GB_APPWRITE_AUTH_SUCCESS}`
  const success = location.toString()

  location.search = `${GB_APPWRITE_AUTH_PARAM}=${GB_APPWRITE_AUTH_FAIL}`
  const failed = location.toString()

  return { success, failed }
}
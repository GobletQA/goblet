import { EEditorType } from '@types'
import { queryToObj, noOpObj } from '@keg-hub/jsutils'

type TQueryData = {
  file?: string
  editor?:EEditorType
  [Key: string]: any
}

/**
 * Gets the query params from the current url location
 * @function
 *
 */
export const getQueryData = () => {
  return typeof document === 'undefined'
    ? noOpObj as TQueryData
    : queryToObj(document?.location?.search) as TQueryData
}

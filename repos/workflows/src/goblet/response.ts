import type {
  TWFResp,
  TResArgs,
} from '@gobletqa/workflows/types'
import { Logger } from '@gobletqa/logger'

/**
 * Successful goblet workflow response
 * @param {Object} resArgs - Response properties
 * @param {Object} extra - Extra properties to add to the response
 * @param {string} message - Success message
 *
 * @return {Object} - Success response object
 */
export const successResp = (
  resArgs:TResArgs,
  extra: Record<string, any>,
  message = 'Workflow executed successfully'
) => {
  Logger.success(message)

  return {
    ...resArgs,
    ...extra,
    message,
    mounted: true,
  } as TWFResp
}

/**
 * Failed goblet workflow response
 *
 * @param {Object} resArgs - Response properties
 * @param {string} message - Fail message
 *
 * @return {Object} - Failed response object
 */
export const failResp = (
  resArgs:TResArgs,
  message = 'Workflow failed to execute'
) => {
  Logger.error(message)

  return {
    ...resArgs,
    message,
    mounted: false,
  } as TWFResp
}
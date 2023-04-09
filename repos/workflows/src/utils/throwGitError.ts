
import { Logger } from '@keg-hub/cli-utils'
import { throwErr } from '../utils/throwErr'

/**
 * Throws an error when a git workflow fails
 * If a message is passed the message is also loged
 *
 * @returns {void}
 */
export const throwGitError = (
  err:Error,
  remoteUrl:string='Unknown',
  message:string=`[WRK-FL Git API] Error calling Git API`
) => {

  if(!err) err = new Error(`[DEV-WARNING] - throwGitError called without error object`)

  Logger.error(message)
  err.stack
    ? console.error(err.stack)
    : err.message && Logger.error(message)

  Logger.empty()

  throwErr(`Error when calling git API - ${remoteUrl}`)
}

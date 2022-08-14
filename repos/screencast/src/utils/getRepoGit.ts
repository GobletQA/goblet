import { Request } from 'express'
import { pickKeys, deepMerge } from '@keg-hub/jsutils'


/**
 * Gets the git keys off the request for all request types
 */
export const getRepoGit = ({ query, params, body }:Request) => {
  return pickKeys(deepMerge(params, query, body), [
    'path',
    'local',
    'remote',
    'branch',
  ])
}

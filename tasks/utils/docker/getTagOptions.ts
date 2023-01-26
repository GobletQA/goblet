import type { TTaskParams, TEnvObject } from '../../types'

import { noOpObj } from '@keg-hub/jsutils'
import { loadEnvs } from '../envs/loadEnvs'
import { getEnvImgTag } from './getEnvImgTag'
import  packageConf from '../../../package.json'
import { getCommitHash } from '../git/getCommitHash'
import { getCurrentBranch } from '../git/getCurrentBranch'

const { version } = packageConf

export type TTagOpts = {
  values?: any
  env?: string
  commit?: string
  branch?: string
  package?: string
  node?: string | number | boolean
}

/**
 * Gets all the available options for tagging an image
 * @export
 * @param {Object} params - Passed in task options, converted into an object
 * @param {Object} envs - Key/Value pairs of envs loaded from the values files
 *
 * @return {Object} - Resolved tagging option values
 */
export const getTagOptions = async (
  params:TTaskParams = noOpObj as TTaskParams,
  docFileCtx:string = ``,
  envs:TEnvObject
) => {
  envs = envs || loadEnvs({ env: params.env })
  const commit = await getCommitHash()
  const branch = await getCurrentBranch()

  return {
    commit,
    branch,
    package: version,
    env: process.env.ENVIRONMENT || params.env,
    node: process.env.NODE_ENV || envs.NODE_ENV,
    values: await getEnvImgTag(params, docFileCtx, envs),
  } as TTagOpts
}

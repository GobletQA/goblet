import type { TTaskParams, ETestType } from '../../types'

import path from 'path'
import { fileSys } from '@keg-hub/cli-utils'
import { ExamConfigMap } from '../../constants'

/**
 * Gets a examConfig path from the passed on config, or the ExamConfigMap based on fileType
 * Then validates the file exists, and throws if it does not
 * @function
 * @public
 * @throws
 * 
 * @param {Object} params - Options passed to the task, converted into an object
 * @param {string} type - Type of config to load based on the testing type
 * 
 * @returns {string} - Path to the found jest config
 */
export const getExamConfig = async ({ testConfig, base }:TTaskParams, type:ETestType) => {
  const configLoc = testConfig ? path.join(base, testConfig) : ExamConfigMap[type]

  // Check if the config path exists, if not throw
  const [existsErr, fileExists] = await fileSys.pathExists(configLoc)
  if(existsErr || !fileExists)
    throw new Error(existsErr || `The jest config path ${configLoc} does not exist`)

  return configLoc
}

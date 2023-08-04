import type { TTaskParams, ETestType } from '../../types'

import path from 'path'
import { fileSys } from '@keg-hub/cli-utils'
import { TestConfigMap } from '../../constants'

/**
 * Gets a testConfig path from the passed on config, or the TestConfigMap based on fileType
 * Then validates the file exists, and throws if it does not
 * @function
 * @public
 * @throws
 * 
 * @param {Object} params - Options passed to the task, converted into an object
 * @param {string} type - Type of config to load based on the testing type
 * 
 * @returns {string} - Path to the found test config
 */
export const getTestConfig = async ({ testConfig, base }:TTaskParams, type:ETestType) => {
  const configLoc = testConfig ? path.join(base, testConfig) : TestConfigMap[type]

  // Check if the config path exists, if not throw
  const [existsErr, fileExists] = await fileSys.pathExists(configLoc)
  if(existsErr || !fileExists)
    throw new Error(existsErr || `The test config path ${configLoc} does not exist`)

  return configLoc
}

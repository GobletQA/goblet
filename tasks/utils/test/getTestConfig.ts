import type { TTaskParams, ETestType } from '../../types'

import path from 'path'
import { exists } from '@keg-hub/jsutils'
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

  if(!exists(configLoc))
    throw new Error(`The test config path ${configLoc} does not exist`)


  return configLoc
}

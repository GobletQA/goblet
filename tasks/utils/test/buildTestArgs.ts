import type { TTaskParams } from '../../types'

import path from 'path'
import { appRoot } from '../../paths'
import { addFlag, addParam } from '@keg-hub/cli-utils'
import { uniqArr, noPropArr } from '@keg-hub/jsutils'

/**
 * Builds the arguments that are passed to test when the test is run
 * @param {Object} params - Parsed task definition options
 *                          See options section of the task definition below
 * @param {string} testConfig - Path the a test config file to load
 */
export const buildTestArgs = (
  params:TTaskParams,
  testConfig:string,
  extraArgs:string[]=noPropArr
) => {
  const {
    context,
    noTests,
    testCI,
    testBail,
    testSync,
    testDebug,
    testCache,
    testColors,
    testVerbose,
    testWorkers,
    testTimeout,
  } = params

  // node ./repos/exam/.bin/exam.js --config ../../app/repos/testUtils/src/exam/exam.config.ts --root /goblet/repos/lancetipton -t Log-In-and-Out.feature
  const cmdArgs = [
    `./repos/exam/.bin/exam.js`,
    ...extraArgs,
    // Convert to milliseconds
    `--timeout=${(parseInt(testTimeout, 10) || 30000)}`,
  ]

  cmdArgs.push(addFlag(`ci`, testCI))
  cmdArgs.push(addFlag(`colors`, testColors))
  cmdArgs.push(addFlag(`verbose`, testVerbose))
  cmdArgs.push(addParam(`workers`, testWorkers))
  // Use the inverse of because testCache default to true
  cmdArgs.push(addFlag(`no-cache`, !testCache))
  cmdArgs.push(addParam(`bail`, testBail))
  cmdArgs.push(addFlag(`debug`, testDebug))
  cmdArgs.push(addFlag(`passWithNoTests`, noTests))
  cmdArgs.push(addParam(`config`, testConfig))

  // Only set runInBand if testWorkers not set.
  // They can not both be passed, and runInBand has a default
  // So if workers is set, then it will override runInBand and its default
  !testWorkers && cmdArgs.push(addFlag(`runInBand`, testSync))

  // If context is set use that as the only file to run
  // Uses glob pattern matching functionality to find the correct test to run
  context && cmdArgs.push(context)

  return uniqArr<string>(cmdArgs.filter(arg => arg), undefined)
}
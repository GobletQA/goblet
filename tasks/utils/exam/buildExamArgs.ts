import type { TTaskParams } from '../../types'

import path from 'path'
import { appRoot } from '../../paths'
import { addFlag } from '@keg-hub/cli-utils'
import { uniqArr, noPropArr } from '@keg-hub/jsutils'

/**
 * Builds the arguments that are passed to jest when the test is run
 * @param {Object} params - Parsed task definition options
 *                          See options section of the task definition below
 * @param {string} examConfig - Path the a jest config file to load
 */
export const buildExamArgs = (
  params:TTaskParams,
  examConfig:string,
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
    testOpenHandles,
  } = params

  // GOBLET_CONFIG_BASE=$(pwd)/src/exam/__tests__ EXAM_DEV_CLI=1 node --no-warnings --loader esbuild-register/loader -r esbuild-register ../exam/src/bin/exam.ts --config ../exam.config.ts --root $(pwd)/src/exam/__tests__

  const cmdArgs = [
    path.join(appRoot, `repos/exam/src/bin/exam.ts`),
    ...extraArgs,
    `--env=node`,
    // Convert to milliseconds
    `--testTimeout=${(parseInt(testTimeout, 10) || 30000)}`,
  ]

  cmdArgs.push(addFlag(`ci`, testCI))
  cmdArgs.push(addFlag(`colors`, testColors))
  cmdArgs.push(addFlag(`verbose`, testVerbose))
  cmdArgs.push(addFlag(`maxWorkers=${testWorkers}`, testWorkers))
  // Use the inverse of because testCache default to true
  cmdArgs.push(addFlag(`no-cache`, !testCache))
  cmdArgs.push(addFlag(`detectOpenHandles`, testOpenHandles))

  cmdArgs.push(addFlag(`bail`, testBail))
  cmdArgs.push(addFlag(`debug`, testDebug))
  cmdArgs.push(addFlag(`passWithNoTests`, noTests))
  cmdArgs.push(addFlag(`config=${examConfig}`, examConfig))

  // Only set runInBand if testWorkers not set.
  // They can not both be passed, and runInBand has a default
  // So if workers is set, then it will override runInBand and its default
  !testWorkers && cmdArgs.push(addFlag(`runInBand`, testSync))

  // If context is set use that as the only file to run
  // Uses Jest pattern matching functionality to find the correct test to run
  // See https://jestjs.io/docs/cli#jest-regexfortestfiles for more info
  context && cmdArgs.push(context)

  return uniqArr<string>(cmdArgs.filter(arg => arg), undefined)
}

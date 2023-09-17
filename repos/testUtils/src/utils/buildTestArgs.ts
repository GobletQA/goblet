import { ETestType } from '@GTU/Types'
import { exists, uniqArr } from '@keg-hub/jsutils'
import { addParam, addFlag } from '@gobletqa/shared/utils/cmdHelpers'

export type TBuildTestArgs = {
  base?:string
  testCI?:boolean
  context?:string
  noTests?:boolean
  testSync?:boolean
  testDebug?:boolean
  testConfig?:string
  testCache?:boolean
  testWorkers?:number
  testTimeout?:number
  testColors?:boolean
  testVerbose?:boolean
  suiteTimeout?:number
  exitOnFailed?:boolean
  testBail?:number|boolean
  testRetry?:boolean|number
  suiteRetry?:boolean|number
  skipAfterFailed?:boolean
}


const buildTestMatch = (
  type:ETestType,
  context?:string,
  base?:string,
) => {

  if(type === ETestType.bdd || type === ETestType.feature)
    return (context && context !== base) ? context : undefined

  // TODO: will add at some point :)
  if(type === ETestType.unit) return undefined

  // TODO: will add at some point :)
  if(type === ETestType.waypoint) return undefined
}


/**
 * Builds the arguments that are passed to test when the test is run
 * @param {Object} params - Parsed task definition options
 *                          See options section of the task definition below
 * @param {string} testConfig - Path the a test config file to load
 */
export const buildTestArgs = (
  params:TBuildTestArgs,
  testConfig:string=params?.testConfig,
  type:ETestType=ETestType.bdd
) => {
  const {
    base,
    context,
    noTests,
    testCI,
    testBail,
    testSync,
    testDebug,
    testRetry,
    suiteRetry,
    testCache,
    testColors,
    testVerbose,
    testWorkers,
    testTimeout,
    suiteTimeout,
    exitOnFailed,
    skipAfterFailed
  } = params

  // node ./repos/exam/.bin/exam.js --config ../../app/repos/testUtils/src/exam/exam.config.ts --root /goblet/repos/lancetipton -t Log-In-and-Out.feature

  const cmdArgs = [
    `node`,
     `-r`,
     `esbuild-register`,
    //  `./repos/exam/.bin/exam.js`,
    `./repos/exam/src/bin/exam.ts`,
  ]

  cmdArgs.push(addFlag(`ci`, testCI))
  cmdArgs.push(addParam(`colors`, testColors))
  cmdArgs.push(addFlag(`verbose`, testVerbose))
  cmdArgs.push(addParam(`workers`, testWorkers))
  // Use the inverse of because testCache default to true
  cmdArgs.push(addFlag(`no-cache`, !testCache))
  cmdArgs.push(addFlag(`debug`, testDebug))
  cmdArgs.push(addParam(`config`, testConfig))
  cmdArgs.push(addParam(`testRetry`, testRetry))
  cmdArgs.push(addParam(`suiteRetry`, suiteRetry))
  cmdArgs.push(addFlag(`passWithNoTests`, noTests))
  cmdArgs.push(addFlag(`exitOnFailed`, exitOnFailed))
  cmdArgs.push(addFlag(`skipAfterFailed`, skipAfterFailed))

  cmdArgs.push(addParam(`root`, base))

  exists(testBail)
    && cmdArgs.push(addParam(`bail`, testBail))

  exists(suiteTimeout)
    && cmdArgs.push(addParam(`timeout`, suiteTimeout))

  exists(testTimeout)
    && cmdArgs.push(addParam(`timeout`, testTimeout))

  // Only set runInBand if testWorkers not set.
  // They can not both be passed, and runInBand has a default
  // So if workers is set, then it will override runInBand and its default
  !testWorkers && cmdArgs.push(addFlag(`runInBand`, testSync))

  // If context is set use that as the only file to run
  // Uses glob pattern matching functionality to find the correct test to run
  if(context){
    const match = buildTestMatch(type, context, base)
    match && cmdArgs.push(addParam(`testMatch`, match))
  }

  const cleaned = uniqArr<string>(cmdArgs.filter(arg => arg), undefined)

  return cleaned
}

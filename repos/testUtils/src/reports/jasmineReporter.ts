import { Logger } from '@gobletqa/shared/libs/logger'
import { noOp, get, noPropArr, isFunc, isStr } from '@keg-hub/jsutils'

type TEvtCB = { name?:string } & ((...args:any[]) => void)
type TContext = Record<any, any>

type TJasmine = {
  getEnv: (...args:any[]) => Record<any, any>
  testPath: string
}



const spaceMap = {
  feature: `  `,
  scenario: `    `,
  background: `    `,
  step: `      `,
}

const eventMap = {
  featureStart: [],
  scenarioStart: [],
  backgroundStart: [],
  ruleStart: [],
  stepStart: [],
  featureEnd: [],
  scenarioEnd: [],
  backgroundEnd: [],
  ruleEnd: [],
  stepEnd: [],
}

/**
 * Holds the name of a test mapped to its current jasmine result context
 */
const failedSpecMap = {}


/**
 * Resolves jasmine from the global context in a safe way
 */
const resolveJasmine = ():TJasmine => {
  return typeof global.jasmine !== 'undefined'
    ? global.jasmine as unknown as TJasmine
    : { getEnv: noOp } as TJasmine
}

/**
 * Helper to log test execution status as it happends
 */
const logResult = (context:TContext) => {
  if(!context.action) return

  switch(context.action){
    case 'start': {
        Logger.stdout(`${spaceMap[context.type] || ``}${context.description}\n`)
      break
    }
    case 'end': {
      Logger.stdout(`${spaceMap[context.type] || ``}${context.description} - ${context.status}\n`)
      break
    }
  }
}

/**
 * Gets the suite type based on the description text
 * The first word should be the type, if not, then it's a feature
 * @function
 * @private
 * @param {Object} suite - Suite object from jasmine reported
 *
 * @returns {string} - The suite type
 */
const getSuiteData = suite => {
  const description = get(suite, `description`)

  let type = !description
    ? `Feature`
    : description.startsWith(`Scenario >`)
      ? `Scenario`
      : description.startsWith(`Background >`)
        ? `Background`
        : description.startsWith(`Rule >`)
          ? `Rule`
          : `Feature`

  return {
    type: type.toLowerCase(),
    description: description.replace(`${type} >`, `${type}:`),
  }
}

export const dispatchEvent = async (
  event:string,
  data:Record<string, any>
) => {
  const callbacks = eventMap[event] || noPropArr
  return await Promise.all(callbacks.map(cb => cb(data)))
}

export const addListener = (
  event:string,
  callback:TEvtCB,
  key:string
) => {
  if(!isFunc(callback))
    throw new Error(`Cannot register ${event} event, callback is not a function`)

  if(!eventMap[event])
    throw new Error(`Cannot register ${event} event, ${event} is not an event type`)

  // @ts-ignore
  callback.name = callback.name || key
  eventMap[event].push(callback)
}

export const removeListener = (event, callback, key) => {
  if(!eventMap[event])
    throw new Error(`Cannot register ${event} event, ${event} is not an event type`)

  if(isStr(callback) && !key) key = callback
  eventMap[event] = eventMap[event].filter(cb => key ? cb.name !== key : cb !== callback)
}

/**
 * Gets the status of the currently active test
 */
export const getTestResult = (testPath) => {
  return failedSpecMap[testPath]
}

/**
 * Builds a custom jasmine reporter
 * Checks failed specs and sets all all specs in a suite to disable when found
 * @function
 * @private
 *
 */
const buildReporter = () => {

  return {
    suiteStarted: suite => {
      const data = getSuiteData(suite)
      return dispatchEvent(`${data.type}Start`, {
        ...suite,
        ...data,
        action: `start`,
        // @ts-ignore
        testPath: global?.jasmine?.testPath,
      })
    },
    specStarted: result => {
      return dispatchEvent(`stepStart`, {
        ...result,
        type: `step`,
        action: `start`,
        // @ts-ignore
        testPath: global?.jasmine?.testPath,
      })
    },
    specDone: result => {
      if(result.status === 'failed') failedSpecMap[result.testPath] = result

      return dispatchEvent(`stepEnd`, {
        ...result,
        type: 'step',
        action: 'end',
        // @ts-ignore
        testPath: global?.jasmine?.testPath,
      })
    },
    suiteDone: suite => {
      const data = getSuiteData(suite)
      return dispatchEvent(`${data.type}End`, {
        ...suite,
        ...data,
        action: `end`,
        // @ts-ignore
        testPath: global?.jasmine?.testPath,
      })
    }
  }
}

/**
 * Creates a custom Jasmine reporter when the jasmine global exists
 */
export const jasmineReporter = () => {
  const jasmineEnv = resolveJasmine().getEnv()
  jasmineEnv &&
    jasmineEnv.describe &&
    jasmineEnv.addReporter(buildReporter())
}

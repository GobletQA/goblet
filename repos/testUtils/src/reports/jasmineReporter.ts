import { Logger } from '@gobletqa/shared/libs/logger'
import { noOp, get, noPropArr, isFunc, isStr, capitalize } from '@keg-hub/jsutils'

type TEvtCB = { name?:string } & ((...args:any[]) => void)
type TContext = Record<any, any>

type TJasmine = {
  getEnv: (...args:any[]) => Record<any, any>
  testPath: string
}

const ResultStatus = {
  failed: `failed`,
  passed: `passed`
}

const spaceMap = {
  browser: ` `,
  feature: `  `,
  scenario: `    `,
  background: `    `,
  step: `      `,
  error: `         `,
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

const logParent = (context:TContext, isStart:boolean) => {

  const isFeature = context.type === `feature`
  
  if(isStart){
    if(isFeature){
      const browserType = (global?.__goblet?.browser?.type || process.env.GOBLET_BROWSER)
        browserType
          ? Logger.stdout(`\n${spaceMap.browser}Browser: ${Logger.colors.brightCyan(capitalize(browserType))}\n`)
          : Logger.empty()
    }

    return Logger.stdout(`${spaceMap[context.type] || ``} ${Logger.colors.white(context.description)}\n`)
  }

  return isFeature && Logger.stdout(`\n`)
}

/**
 * Helper to log test execution status as it happends
 */
const logResult = (context:TContext, hasStepErr?:boolean) => {

  const isParent = context.type !== `step`
  const isStart = context.action === `start`

  if(isParent) return logParent(context, isStart)

  if(!context.action || isStart) return

  const prefix = hasStepErr
    ? `${spaceMap[context.type] || ``}${Logger.colors.yellow(`○`)}`
    : context.status === ResultStatus.passed
      ? `${spaceMap[context.type] || ``}${Logger.colors.green(`✓`)}`
      : `${spaceMap[context.type] || ``}${Logger.colors.red(`✕`)}`

  let message = hasStepErr
    ? `${prefix} ${Logger.colors.yellow(context.description)}\n`
    : context.status === ResultStatus.passed
      ? `${prefix} ${Logger.colors.gray(context.description)}\n`
      : `${prefix} ${Logger.colors.red(context.description)}\n`

  context?.failedMessage && 
    (message += `\n${context?.failedMessage}\n\n`)

  Logger.stdout(message)

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


const getFailedMessage = (result) => {
  if(result.status !== ResultStatus.failed) return {}
  
  if(!result?.failedExpectations?.length) return {}

  const failed = result?.failedExpectations?.[0]
  if(!failed || !failed?.message) return {}

  // TODO: add better handling of error message
  // Include the error.matcherResult data colorized
  // failed?.error?.matcherResult.actual vs failed?.error?.matcherResult.expected

  // Clean up log output errors from playwright
  const duplicates = []
  const startsWith = [
    `===========================`
  ]

  return {
    failedMessage: `${failed.message}`.split(`\n`)
      .map(line => {
        const trimmed = line.trim()

        if(!trimmed) return false
        if(duplicates.includes(line)) return false
        if(startsWith.find(filter => trimmed.startsWith(filter))) return false

        duplicates.push(line)
        return `${spaceMap.error}${line}`
      })
      .concat([ result?.testPath ? `\n${spaceMap.error}Test Path: ${result.testPath}` : false])
      .filter(Boolean)
      .join(`\n`)
  }

}

export const dispatchEvent = async (
  event:string,
  data:Record<string, any>,
  hasStepErr?:boolean
) => {
  logResult(data, hasStepErr)
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

  let hasStepErr:boolean

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
      const specFailed = result.status === ResultStatus.failed
      if(specFailed) failedSpecMap[result.testPath] = result

      const resp = dispatchEvent(`stepEnd`, {
        ...result,
        type: `step`,
        action: `end`,
        ...getFailedMessage(result),
        // @ts-ignore
        testPath: global?.jasmine?.testPath,
      }, hasStepErr)
      
      // Set hasStepErr after reporting the step that failed
      if(specFailed) hasStepErr = true
      
      return resp
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
    },
    /**
     * Unfortunately this runs after every test file
     * Need a hook that runs at the end of all tests files
     */
    // jasmineDone: async (result) => {
    //   if(!global.browser)
    //     return process.stdout.write(`Skipping close browser; browser could not be found!\n`)

    //   const browserType = capitalize(global?.__goblet?.browser?.type || process.env.GOBLET_BROWSER || ``)
    //   process.stdout.write(`Closing ${browserType || `browser`}...\n`)
    //   return await global.browser.close()
    // }
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

import { build } from './build'
import { Logger } from '@keg-hub/cli-utils'
import { ensureArr, deepMerge, limbo } from '@keg-hub/jsutils'
import { getContexts, getLongContext } from '../../utils/helpers/contexts'

/**
 * Helper to log an image build error
 * Errors do not actually throw / stop the process
 * They are captured an logged, so other images can be built even if one fails
 */
const logBuildErr = (ctx:string, err:Error) => {
  Logger.empty()
  Logger.error(`Error building image for ${ctx}`)
  Logger.log(err.stack)
  Logger.empty()
}

/**
 * Runs a docker build command for multiple images
 * @function
 * @public
 * @param {string|Array<string>} cmd - kubectl command to build split as an array
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Void}
 */
const buildPush = async (args) => {
  const { params } = args
  const { context } = params

  const contexts = context && context?.length && !context.includes(`all`)
    ? context
    : getContexts()?.CONTEXT_LIST

  let login = true

  const result = await ensureArr(contexts).reduce(async (toResolve, ctx) => {
    const acc = await toResolve
    const lCtx = getLongContext(ctx)
    if(!lCtx){
      logBuildErr(ctx, new Error(`Skip building ${ctx}. Could not find long context`))
      return acc
    }

    Logger.info(`\nBuilding image for ${lCtx}...\n`)

    const [err, resp] = await limbo(build.action(deepMerge(args, {
      params: {
        login,
        push: true,
        context: lCtx,
      }
    })))

    // We only need to login the first time, after that we can skip it
    login = false

    err && logBuildErr(ctx, err)
    acc.push(resp)

    return acc
  }, Promise.resolve([]))

  return result
}

export const images = {
  name: 'images',
  alias: ['imgs'],
  action: buildPush,
  example: 'yarn task dev img build <options>',
  description: 'Calls the image build command',
  options: {
    ...build.options,
    context: {
      type: `array`,
      example: `--context be,fe`,
      alias: [`ctx`, `name`, `type`],
      description: `Contexts or names of images to build`,
    },
  }
}

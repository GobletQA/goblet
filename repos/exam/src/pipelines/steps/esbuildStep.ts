import { TPipelineArgs } from '@GEX/types'
import { register } from 'esbuild-register/dist/node'
import { Logger } from '@GEX/utils/logger'

export const esbuildStep = async (args:TPipelineArgs) => {
  Logger.debug(`------- esbuildStep -------`)
  const { config } = args

  const opts = config.esbuild ? config.esbuild : {}
  const deregister = register(opts)

  const unregister = (args:TPipelineArgs) => {
    deregister.unregister()
    return args
  }

  args.reverse.push(unregister)

  return args
}


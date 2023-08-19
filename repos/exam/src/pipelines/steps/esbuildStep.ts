import type { TPipelineArgs } from '@GEX/types'
import { register } from 'esbuild-register/dist/node'


export const esbuildStep = async (args:TPipelineArgs) => {
  const { config } = args

  const opts = config.esbuild ? config.esbuild : {}
  register(opts)

}


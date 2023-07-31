import {createRequire} from 'module'
import { TPipelineArgs } from '@GEX/types'

export const createRequireTask = (args:TPipelineArgs) => {
  const { config } = args
  return createRequire(config.rootDir)
}
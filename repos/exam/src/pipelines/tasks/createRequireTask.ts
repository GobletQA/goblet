import {createRequire} from 'module'
import { TPipelineArgs } from '../types'

export const createRequireTask = (args:TPipelineArgs) => {
  const { config } = args
  return createRequire(config.rootDir)
}
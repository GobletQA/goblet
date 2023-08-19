import {createRequire} from 'module'
import { TPipelineArgs } from '@GEX/types'

export const createRequireTask = (args:Pick<TPipelineArgs, `config`>) => {
  const { config } = args
  return createRequire(config.rootDir)
}
import {PipelineTag} from '@GEX/constants/tags'
import {
  TPipelineInit,
  TPipelineArgs,
} from '@GEX/types'

import { isNum } from '@keg-hub/jsutils/isNum'
import { exists } from '@keg-hub/jsutils/exists'
import { isBool } from '@keg-hub/jsutils/isBool'
import { ensureArr } from '@keg-hub/jsutils/ensureArr'


export const formatArgsTask = (args:TPipelineInit|TPipelineArgs) => {
  const {
    tag,
    file,
    config,
    testMatch,
    ...rest
  } = args

  const tests = exists(testMatch)
    ? ensureArr(testMatch)
    : file
      ? ensureArr(file)
      : undefined

    const bail = isBool(config.bail)
      ? config.bail ? 1 : 0
      : isNum(config.bail) ? config.bail : 0

    const passWithNoTests = exists(config.passWithNoTests)
      ? config.passWithNoTests
      : false

  return {
    ...rest,
    testMatch: tests,
    tag: tag || PipelineTag,
    config: {
      ...config,
      bail,
      passWithNoTests,
    },
  }
  
}

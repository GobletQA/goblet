import {PipelineTag} from '@GEX/constants/tags'
import {
  TPipelineInit,
  TPipelineArgs,
} from '@GEX/types'
import { JasmineCompat } from '@GEX/utils/jasmineCompat'
import {exists, ensureArr, isBool, isNum} from '@keg-hub/jsutils'

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
      globals: {
        ...config.globals,
        // Remove this once the other testUtils methods are updated
        ...JasmineCompat
      }
    },
  }
  
}

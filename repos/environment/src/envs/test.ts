import type { TGenEnv } from "@GENV/types"
import {toBool} from "@keg-hub/jsutils"

const {
  EXAM_LOG_LEVEL,
  EXAM_CLI_DEBUG,
  EXAM_CLI_VERBOSE,
  GOBLET_TEST_VERBOSE,
  GOBLET_TEST_DEBUG
} = process.env

const test = (general:TGenEnv) => {
  
  return {
    EXAM_LOG_LEVEL: EXAM_LOG_LEVEL,
    EXAM_CLI_DEBUG: toBool(EXAM_CLI_DEBUG),
    EXAM_CLI_VERBOSE: toBool(EXAM_CLI_VERBOSE),
    GOBLET_TEST_DEBUG: toBool(GOBLET_TEST_DEBUG),
    GOBLET_TEST_VERBOSE: toBool(GOBLET_TEST_VERBOSE),
  }
}

export default test

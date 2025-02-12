import type { TGenEnv } from "../types"

import { asNum } from "../utils/asNum"
import { asBool } from "../utils/asBool"
import { exists } from '@keg-hub/jsutils/exists'
import { ExamJsonReporterEvtSplit } from '../constants/exam'

const test = (general:TGenEnv) => {

  const {
    EXAM_LOG_LEVEL,
    EXAM_CLI_DEBUG,
    EXAM_CLI_VERBOSE,
    EXAM_LOG_ERR_EVENT,
    EXAM_EVENT_LOG_SPLIT_KEY=ExamJsonReporterEvtSplit,
    
    GOBLET_RUN_FROM_UI,
    GOBLET_RUN_FROM_CI,

    GOBLET_TEST_TIMEOUT,
    GOBLET_SUITE_TIMEOUT,

    GOBLET_TEST_TYPE,
    GOBLET_TEST_RETRY,
    GOBLET_TEST_REPORT,
    GOBLET_TEST_TRACING,
    GOBLET_TEST_VIDEO_RECORD,

    GOBLET_PAGE_REUSE,
    GOBLET_CONTEXT_REUSE,
    GOBLET_TEST_SCREENSHOT,
    GOBLET_TEST_TRACING_SOURCES,
    GOBLET_TEST_TRACING_SNAPSHOTS,
    GOBLET_TEST_TRACING_SCREENSHOTS,
    GOBLET_TEST_HTML_COMBINE_REPORT,
    PARKIN_FEATURE_NAME,
    PARKIN_FEATURE_TAGS,
    GOBLET_FEATURE_TAGS=PARKIN_FEATURE_TAGS,
    GOBLET_FEATURE_NAME=PARKIN_FEATURE_NAME,
    GB_LOGGER_FORCE_DISABLE_SAFE,

    /**
     * Technically this can be used in other environments
     * But it's really only used for the UI
     * Allows saving the test reports to a temp dir
     * Which then allows the user to download them
     */
    GOBLET_CUSTOM_REPORTS_DIR,
    /**
     * Pass custom options to the exam reporter
     * Expected to be a stringified JSON object - i.e. JSON.stringify({ ...reporter options })
     */
    GOBLET_TEST_HTML_REPORTER_OPTS,
    GOBLET_TEST_CLI_REPORTER_OPTS,
    GOBLET_TEST_JSON_REPORTER_OPTS,
  } = process.env

  const GOBLET_TEST_DEBUG = asBool(process.env.GOBLET_TEST_DEBUG)
  const GOBLET_TEST_VERBOSE = asBool(process.env.GOBLET_TEST_VERBOSE)

  return {
    EXAM_LOG_ERR_EVENT,
    EXAM_EVENT_LOG_SPLIT_KEY,
    EXAM_LOG_LEVEL: EXAM_LOG_LEVEL ?? general.GB_LOG_LEVEL,
    EXAM_CLI_DEBUG: asBool(EXAM_CLI_DEBUG ?? GOBLET_TEST_DEBUG),
    EXAM_CLI_VERBOSE: asBool(EXAM_CLI_VERBOSE ?? GOBLET_TEST_VERBOSE),

    GOBLET_RUN_FROM_UI,
    GOBLET_RUN_FROM_CI,
    GB_LOGGER_FORCE_DISABLE_SAFE: general.NODE_ENV !== `production` ? `1` : undefined,

    GOBLET_FEATURE_TAGS,
    GOBLET_FEATURE_NAME,

    GOBLET_TEST_DEBUG: GOBLET_TEST_DEBUG,
    GOBLET_TEST_VERBOSE: GOBLET_TEST_VERBOSE,

    GOBLET_TEST_TYPE,
    GOBLET_TEST_REPORT,
    GOBLET_TEST_TRACING,
    GOBLET_TEST_VIDEO_RECORD,

    GOBLET_PAGE_REUSE: asBool(GOBLET_PAGE_REUSE),
    GOBLET_CONTEXT_REUSE: asBool(GOBLET_CONTEXT_REUSE),
    GOBLET_TEST_SCREENSHOT: asBool(GOBLET_TEST_SCREENSHOT ?? true),
    GOBLET_TEST_RETRY: asNum(GOBLET_TEST_RETRY, { default: 1, exists: true }),
    GOBLET_TEST_TRACING_SOURCES: asBool(GOBLET_TEST_TRACING_SOURCES ?? true),
    GOBLET_TEST_TRACING_SNAPSHOTS: asBool(GOBLET_TEST_TRACING_SNAPSHOTS ?? true),
    GOBLET_TEST_TRACING_SCREENSHOTS: asBool(GOBLET_TEST_TRACING_SCREENSHOTS ?? true),
    GOBLET_TEST_TIMEOUT: asNum(GOBLET_TEST_TIMEOUT, { exists: true, default: undefined }),
    GOBLET_SUITE_TIMEOUT: asNum(GOBLET_SUITE_TIMEOUT, { exists: true, default: undefined }),

    GOBLET_CUSTOM_REPORTS_DIR,
    GOBLET_TEST_CLI_REPORTER_OPTS,
    GOBLET_TEST_JSON_REPORTER_OPTS,
    GOBLET_TEST_HTML_REPORTER_OPTS,
    GOBLET_TEST_HTML_COMBINE_REPORT: exists(GOBLET_TEST_HTML_COMBINE_REPORT)
      ? asBool(GOBLET_TEST_HTML_COMBINE_REPORT)
      : undefined,
  }

}

export default test

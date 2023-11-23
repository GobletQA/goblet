import { EPlayerTestType } from '@GEX/types'
import { EResultAction } from '@ltipton/parkin'

export const ExamCfgArrayItems = [
  `testMatch`,
  `reporters`,
  `preRunner`,
  `postRunner`,
  `testIgnore`,
  `loaderIgnore`,
  `preEnvironment`,
  `postEnvironment`,
  `transformIgnore`,
]

export const RootDirKey = `<rootDir>`
export const NoTestsPassId = `NO-TESTS-FOUND`

export const NoTestsFoundPass = {
  passed: true,
  timestamp: 0,
  describes: [],
  failed: false,
  skipped: false,
  testPath: `none`,
  id: NoTestsPassId,
  fullName: `No Tests Found`,
  action: `end` as const,
  status: `passed` as const,
  type: `describe` as const,
  description: `No tests were found and "passWithNoTests" is active`,
}

export const TestsResultStatus = {
  failed: `failed`,
  passed: `passed`,
  skipped: `skipped`
}

export const RootSuiteId = `suite-0`


export const ExamCfgModeTypes = [
  `serial`,
  `parallel`
]

export const ExamCfgModeType = ExamCfgModeTypes.reduce(
  (acc, type) => ({...acc, [type]: type}),
  {} as Record<string, string>
)

export const BuiltTestResultFailed = {
  failed: true,
  passed: false,
  skipped: false,
  failedExpectations: [],
  passedExpectations: [],
  description: `Test failed`,
  action: `end` as const,
  type: `describe` as const,
  status: `failed`  as const,
}

export const BuiltExamEnded = {
  stats: {},
  testPath: `/`,
  failed: false,
  passed: false,
  skipped: false,
  timestamp: 0,
  describes: [],
  action: `ended`,
  id: EPlayerTestType.ended,
  type: EPlayerTestType.ended,
  fullName: EPlayerTestType.ended,
  description: `Exam test execution has finished`,
}

export const BuiltExamStopped = {
  timestamp: 0,
  testPath: `/`,
  failed: false,
  passed: false,
  skipped: false,
  action: `stopped`,
  id: EPlayerTestType.stopped,
  type: EPlayerTestType.stopped,
  description: `Exam has stopped`,
  fullName: EPlayerTestType.stopped,
}


export const ExamJsonReporterEvtSplit = `<--|-->GOBLET-EXAM-JSON-SPLIT<--|-->`
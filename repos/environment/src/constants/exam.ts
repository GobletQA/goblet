import type { EPlayerTestAction, EPlayerTestType, EPlayerTestStatus } from '@GENV/types'


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
  action: `end` as EPlayerTestAction,
  type: `describe` as EPlayerTestType,
  status: `passed` as EPlayerTestStatus,
  description: `No tests were found and "passWithNoTests" is active`,
}

export const TestsResultStatus = {
  failed: `failed`,
  passed: `passed`
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
  action: `end` as EPlayerTestAction,
  type: `describe` as EPlayerTestType,
  status: `failed` as EPlayerTestStatus,
}
import type { TExEventData } from "@GEX/types"
import {
  EPlayerTestType,
  EPlayerTestAction,
  EPlayerTestStatus,
} from "@GEX/types"

export const FileTypeMap = {
  env: `env`,
  yml: `yaml`,
  html: `html`,
  json: `json`,
  yaml: `yaml`,
  js: `javascript`,
  jsx: `javascript`,
  cjs: `javascript`,
  mjs: `javascript`,
  ts: `typescript`,
  mts: `typescript`,
  cts: `typescript`,
  feature: `feature`,
}

export const ExamCfgModeTypes = [
  `serial`,
  `parallel`
]

export const ExamCfgArrayItems = [
  `testMatch`,
  `reporters`,
  `preRunner`,
  `postRunner`,
  `testIgnore`,
  `extensions`,
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
  action: EPlayerTestAction.end,
  type: EPlayerTestType.describe,
  status: EPlayerTestStatus.passed,
  description: `No tests were found and "passWithNoTests" is active`,
}

export const BuiltTestResultFailed:Partial<TExEventData> = {
  failed: true,
  passed: false,
  skipped: false,
  failedExpectations: [],
  passedExpectations: [],
  description: `Test failed`,
  action: EPlayerTestAction.end,
  type: EPlayerTestType.describe,
  status: EPlayerTestStatus.failed,
}

export const GlobMatchKeys = [`**`,`*`,`[`,`]`,`|`,`...`,`{`,`}`,`?`,`@`,`+`,`!`,`:`]
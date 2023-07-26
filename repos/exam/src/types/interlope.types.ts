import type { TExamConfig } from "./exam.types"

export type TEXInterReporterContext = {
  firstRun: boolean
  previousSuccess: boolean
  changedFiles?: Set<string>
  sourcesRelatedToTestsInChangedFiles?: Set<string>
  startRun?: (config: TExamConfig) => unknown
}

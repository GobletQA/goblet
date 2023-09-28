import type { TAddTestRun } from '@types'

import { testRunsDispatch } from "@store"

export const clearTestRuns = () => {
  testRunsDispatch.clearTestRuns()
}

import type { TUpsertTestRun } from '@types'

import { testRunsDispatch } from "@store"

export const upsertTestRun = (props:TUpsertTestRun) => {
  testRunsDispatch.upsertTestRun(props)
}

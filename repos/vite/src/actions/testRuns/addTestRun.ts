import type { TAddTestRun } from '@types'

import { testRunsDispatch } from "@store"

export const addTestRun = (props:TAddTestRun) => {
  testRunsDispatch.addTestRun(props)
}
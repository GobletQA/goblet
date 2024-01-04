import { TPipelineArgs, TPipeTestPrep } from "@GEX/types"

import { promiseSeries } from '@GEX/utils/promiseSeries'

export const runTestsTask = async (args:TPipelineArgs, tests:TPipeTestPrep[]) => {
  const { state } = args
  return await promiseSeries(
    tests,
    async ({ model, Runner }) => await Runner.run(model, state)
  )
}
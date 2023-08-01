import { TPipelineArgs, TPipeTestPrep } from "@GEX/types"

import pMapSeries from 'p-map-series'

export const runTestsTask = async (args:TPipelineArgs, tests:TPipeTestPrep[]) => {
  const { state, } = args

  return await pMapSeries(
    tests,
    async ({ model, Runner }) => await Runner.run(model, state)
  )

}
import { TPipelineArgs, IExamRunner, TExFileModel } from "@GEX/types"

import pMapSeries from 'p-map-series'

export const runTestsTask = async (args:TPipelineArgs, tests:Record<any, any>) => {
  const { state, } = args

  return await pMapSeries(
    tests as { model: TExFileModel, Runner: IExamRunner<any>}[],
    async ({ model, Runner }) => await Runner.run(model, state)
  )

}
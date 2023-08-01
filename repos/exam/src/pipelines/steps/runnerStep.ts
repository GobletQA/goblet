import type { TPipelineArgs, TStateManager } from '@GEX/types'

import { runTestsTask } from '../tasks/runTestsTask'
import { loadRunnerTask } from '../tasks/loadRunnerTask'

export const runnerStep = async (args:TPipelineArgs, manager?:TStateManager) => {

  const runners = await loadRunnerTask(args)
  const outcomes = await runTestsTask(args, runners)

  manager.setValue(`TestResults`, outcomes)
  
  args.rewind.push(() => {
    runners.map(async ({ model, Runner }) => await Runner?.cleanup?.())
  })

}

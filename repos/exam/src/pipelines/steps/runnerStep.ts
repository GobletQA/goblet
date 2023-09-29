import type { TExRunResult, TPipelineArgs, TStateManager } from '@GEX/types'
import type { TestErr } from '@GEX/utils/error'

import { runTestsTask } from '../tasks/runTestsTask'
import { loadRunnerTask } from '../tasks/loadRunnerTask'
import {limbo} from '@keg-hub/jsutils/limbo'

export const runnerStep = async (args:TPipelineArgs, manager?:TStateManager) => {
  const runners = await loadRunnerTask(args)
  const [error, outcomes] = await limbo<TExRunResult[], TestErr>(runTestsTask(args, runners))

  if(error){
    error.result && 
     manager.setValue(`TestResults`, [error.result])

    throw error
  }

  manager.setValue(`TestResults`, outcomes)

  args.rewind.push(() => {
    runners.map(async ({ model, Runner }) => await Runner?.cleanup?.())
  })

}

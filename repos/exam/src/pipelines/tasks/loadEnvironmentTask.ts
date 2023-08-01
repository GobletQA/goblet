import type { IConstructable, IExamEnvironment, TPipelineArgs } from "@GEX/types"

import {exists, isStr} from "@keg-hub/jsutils"
import { loadFilesTask }  from './loadFilesTask'
import { BaseEnvironment } from '@GEX/environment/BaseEnvironment'


export const loadEnvironmentTask = async (args:TPipelineArgs) => {
  const { config } = args
  const { globals, envs } = config
  
  if(exists(config.environment)){
    const [location, options] = isStr(config.environment)
      ? [config.environment, {}] as [string, any]
      : config.environment as [string, any]

    const loaded = await loadFilesTask<{Environment: IConstructable<IExamEnvironment<any>>}>(
      args,
      { Environment: location }
    )

    if(loaded.Environment)
      return new loaded.Environment({
        ...options,
        globals: {...globals, ...options?.globals },
        envs: {...envs, ...options?.envs}
      })
  }

  return new BaseEnvironment({ globals, envs })
}
import {TPipelineArgs} from "@GEX/types";
import { loadFilesTask }  from './loadFilesTask'
import { BaseEnvironment } from '@GEX/environment/BaseEnvironment'
import {exists, isStr} from "@keg-hub/jsutils"


export const loadEnvironmentTask = async (args:TPipelineArgs) => {
  const { config } = args
  const { globals, envs } = config
  
  if(exists(config.environment)){
    const [location, options] = isStr(config.environment)
      ? [config.environment, {}] as [string, any]
      : config.environment as [string, any]

    const loaded = await loadFilesTask(args, { Environment: location }) as any

    if(loaded.Environment)
      return new loaded.Environment({
        ...options,
        globals: {...globals, ...options?.globals },
        envs: {...envs, ...options?.envs}
      })
  }

  return new BaseEnvironment({ globals, envs })
}
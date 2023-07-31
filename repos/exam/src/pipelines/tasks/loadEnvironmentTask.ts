import {TPipelineArgs} from "../types";
import { loadFilesTask }  from './loadFilesTask'
import { BaseEnvironment } from '@GEX/environment/BaseEnvironment'
import {isStr} from "@keg-hub/jsutils";


export const loadEnvironmentTask = async (args:TPipelineArgs) => {
  const { config } = args
  const { globals, envs } = config
  
  if(exists(config.environment)){
    const [location, options] = isStr(config.environment)
      ? [config.environment, {}] as [string, any]
      : config.environment as [string, any]

    const loaded = await loadFilesTask(args, { Environment: location })

    // envLoad[1] = { globals, envs, ...envLoad[1] }

  }

  const Environment = new BaseEnvironment({ globals, envs })

  return Environment
}
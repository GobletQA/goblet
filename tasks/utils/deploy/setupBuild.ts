import type { TBuildFE } from './buildFrontend'
import type { TTaskActionArgs } from '../../types'

import { isArr } from '@keg-hub/jsutils'
import { loadEnvs } from '../envs/loadEnvs'
import { containerDir } from '../../paths'
import { formatParamEnvs }  from '../envs/formatParamEnvs'

/**
 * Loads all the meta data needed to run the build function
 * @param {function} - Build function for a part of the goblet app ( frontend, backend, screencast )
 * 
 * @returns {function} - Method to call when building a part of the goblet app
 */
export const setupBuild = (buildFunc:(args:TBuildFE) => void) => {
  return async (args:TTaskActionArgs, buildType:string) => {
    const {params} = args
    const {tags, envs, env} = params

    const loadedEnvs = loadEnvs({
      env,
      noEnv: true,
      locations: [
        containerDir,
      ],
    })

    return await buildFunc({
      params,
      buildType,
      tags: [...(isArr(tags) ? tags : []), `goblet-${buildType}:prod`],
      envs: {
        ...loadedEnvs,
        ...formatParamEnvs(envs),
        // Ensure npx auto-installs repos
        npm_config_yes: true,
        // For deployment builds, force node to run in production
        NODE_ENV: `production`,
      },
    })
  }
}

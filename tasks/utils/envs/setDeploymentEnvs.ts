import { exists } from '@keg-hub/jsutils'
import { getDeploymentOpts } from '../helpers/contexts'

/**
 * Sets envs for all apps the should be included in the command
 *
 * @return {void}
 */
export const setDeploymentEnvs = (
  env:string,
  deployArr?:string[]
) => {
  const deployOpts = getDeploymentOpts(env)
  const { activeMap } = deployOpts

  ;(deployArr || deployOpts.deployArr).forEach((deployment:string) => {
    const env = activeMap[deployment]
    !exists(process.env[env]) && (process.env[env] = deployment)
  })
}


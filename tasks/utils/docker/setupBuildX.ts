import type { TEnvObject } from '../../types'

import { docker, error } from '@keg-hub/cli-utils'

/**
 * Sets the docker buildx builder instance
 */
export const setupBuildX = async (
  builder:string,
  appRoot:string,
  allEnvs:TEnvObject
) => {
  // Create the buildx goblet context if it does not exist
  await docker([`buildx`, `create`, `--name`, builder], {
    cwd: appRoot,
    env: allEnvs,
    exec: true,
  })

  // Then try to use it, if we don't get an exitCode 0 response, then throw an error
  const { exitCode } = await docker([`buildx`, `use`, builder], {
    exec: true,
    cwd: appRoot,
    env: allEnvs,
  })

  exitCode &&
    error.throwError(
      `Could not switch to buildx context "goblet". Please update the context manually`
    )
}


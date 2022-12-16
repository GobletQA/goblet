import type { TTaskActionArgs, TContainerEnvs } from '../../types'

import path from 'path'
import { appRoot } from '../../paths'
import { fileSys } from '@keg-hub/cli-utils'

/**
 * Gets the name of a firebase project based on those defined in the .firebaserc file
 */
export const getFirebaseProject = async (
  { params }:TTaskActionArgs,
  envs:TContainerEnvs
) => {
  const { env } = params

  const project = params.project || envs.NODE_ENV || env
  const content = fileSys.readFileSync(path.join(appRoot, `.firebaserc`))
  const data = JSON.parse(content)

  return data.projects[project] ?? envs.FIRE_BASE_PROJECT_ID ?? project
}

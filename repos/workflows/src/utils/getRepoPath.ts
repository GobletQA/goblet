import path from 'path'

import { noOpObj } from '@keg-hub/jsutils'
import { ENVS } from '@gobletqa/environment'
import { TGitMeta } from '@gobletqa/workflows/types'
import { generateFolderName } from './generateFolderName'

/**
 * Gets the path to a repo location based on passed in params
 * @function
 * @public
 * @throws
 *
 * @param {Object} args
 *
 * @returns {string} - Path to the mounted repo
 */
export const getRepoPath = (args:TGitMeta=noOpObj) => {
  const { user, repo } = args

  const folderName = generateFolderName(user, repo)
  if (folderName) return path.join(ENVS.GOBLET_MOUNT_ROOT, folderName)

  throw new Error(`A user name is required generate a repo path`)
}

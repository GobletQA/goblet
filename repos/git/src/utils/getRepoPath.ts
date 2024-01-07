import type { TGitMeta } from '@GGT/types'

import path from 'path'
import { ENVS } from '@gobletqa/environment'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
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
export const getRepoPath = (args:TGitMeta=emptyObj) => {
  const { user } = args

  const folderName = generateFolderName(user)
  if (folderName) return path.join(ENVS.GOBLET_MOUNT_ROOT, folderName)

  throw new Error(`A user name is required generate a repo path`)
}

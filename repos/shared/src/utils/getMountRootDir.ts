import path from 'path'
import { ENVS } from '@gobletqa/environment'

/**
 * Gets the mount root directory
 * Normalizes it, so all references to it are consistent
 */
export const getMountRootDir = () => {
  return path.resolve(ENVS.GOBLET_MOUNT_ROOT)
}


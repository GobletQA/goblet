import path from 'path'

const { GOBLET_MOUNT_ROOT=`/goblet/repos` } = process.env

/**
 * Gets the mount root directory
 * Normalizes it, so all references to it are consistent
 */
export const getMountRootDir = () => {
  return path.resolve(GOBLET_MOUNT_ROOT)
}


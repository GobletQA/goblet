import path from 'path'
import { ENVS } from '@gobletqa/environment'

export const getMountRootDir = () => {
  return path.resolve(ENVS.GOBLET_MOUNT_ROOT)
}
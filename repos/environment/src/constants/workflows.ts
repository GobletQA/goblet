import { ENVS } from '../envs'
import path from 'path'

/**
 * Constants for running the workflows with consistent values
 * @readonly
 */

export const GitResetBranch = `goblet-sync-revert-branch`
export const RepoLocalMount = ENVS.GOBLET_MOUNT_ROOT && ENVS.GB_SH_LOCAL_MOUNT
  ? path.join(ENVS.GOBLET_MOUNT_ROOT, ENVS.GB_SH_LOCAL_MOUNT)
  : `/goblet/repos/goblet-local`

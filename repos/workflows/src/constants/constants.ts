import path from 'path'
const { GOBLET_MOUNT_ROOT=`/goblet/repos` } = process.env
const { GB_SH_LOCAL_MOUNT=`goblet-local` } = process.env
const { GB_SECRETS_TAG_REF=`goblet-do-not-delete` } = process.env
const { GB_GIT_GLOBAL_IGNORE=`/goblet/.gitignore` } = process.env

/**
 * Constants for running the workflows with consistent values
 * @readonly
 */
export const REPO_TAG_REF = GB_SECRETS_TAG_REF 
export const MOUNT_ROOT = path.resolve(GOBLET_MOUNT_ROOT)
export const LOCAL_MOUNT = path.join(MOUNT_ROOT, GB_SH_LOCAL_MOUNT)
export const GIT_GLOBAL_IGNORE = path.resolve(GB_GIT_GLOBAL_IGNORE)
export const GB_GIT_REMOTE_REF = process.env.GB_GIT_REMOTE_REF || `goblet-ref`


import path from 'path'
const { GOBLET_MOUNT_ROOT=`/goblet/repos` } = process.env
const { GB_SH_LOCAL_MOUNT=`goblet-local` } = process.env
const { GB_SECRETS_TAG_REF=`goblet-do-not-delete` } = process.env

/**
 * Constants for running the workflows with consistent values
 * @readonly
 */
export const REPO_TAG_REF = GB_SECRETS_TAG_REF 
export const MOUNT_ROOT = path.resolve(GOBLET_MOUNT_ROOT)
export const LOCAL_MOUNT = path.join(MOUNT_ROOT, GB_SH_LOCAL_MOUNT)

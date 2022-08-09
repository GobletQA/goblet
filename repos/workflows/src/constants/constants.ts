import path from 'path'
export { GRAPH } from './graph'
const { GB_SH_MOUNT_ROOT=`/goblet/repos` } = process.env
const { GB_SH_LOCAL_MOUNT=`goblet-local` } = process.env

/**
 * Constants for running the workflows with consistent values
 * Frozen so the values can not be changed
 * @readonly
 */
export const MOUNT_ROOT = path.resolve(GB_SH_MOUNT_ROOT)
export const LOCAL_MOUNT = path.join(MOUNT_ROOT, GB_SH_LOCAL_MOUNT)

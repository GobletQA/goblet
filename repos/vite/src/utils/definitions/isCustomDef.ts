import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'

export const isCustomDef = (location:string, rootPrefix?:string) => {
  const removed = rmRootFromLoc(location, rootPrefix)
  return Boolean(location !== removed)
}
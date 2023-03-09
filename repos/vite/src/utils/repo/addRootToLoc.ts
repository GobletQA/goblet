import { getRootPrefix } from '@utils/repo/getRootPrefix'

export const addRootToLoc = (loc:string, root?:string) => {
  root = root || getRootPrefix()
  return loc.startsWith(root) ? loc : `${root}${loc}`
}
import { getRootPrefix } from '@utils/repo/getRootPrefix'

export const rmRootFromLoc = (loc:string, root?:string, postfix?:string) => {
  root = root || getRootPrefix(undefined, postfix)
  return loc.startsWith(root) ? loc.replace(root, ``) : loc
}
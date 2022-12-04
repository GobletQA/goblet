import { getRootPrefix } from '@utils/repo/getRootPrefix'

export const rmRootFromLoc = (loc:string, root?:string) => {
  root = root || getRootPrefix()
  return loc.replace(root, ``)
}
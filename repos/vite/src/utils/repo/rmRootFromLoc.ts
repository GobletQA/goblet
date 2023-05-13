import type { TRepoState } from '@types'

import { getRootPrefix } from '@utils/repo/getRootPrefix'

export const rmRootFromLoc = (
  loc:string,
  root?:string,
  postfix?:string,
  repo?:TRepoState
) => {
  root = root || getRootPrefix(repo, postfix)

  return loc.startsWith(root) ? loc.replace(root, ``) : loc
}
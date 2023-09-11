import type { TRepoOpts } from '@types'
import type { MouseEvent } from 'react'
import type { TMenuItem } from '@gobletqa/components'
import type { TExpPart, TRaceMenuItem, TRaceMenuItemClickCtx } from '@gobletqa/race'

import { getStore} from '@store'
import { ContextItem } from './ContextItem'
import { EAstObject } from '@ltipton/parkin'
import { ExpressionKinds } from '@constants'
import { UploadFileIcon } from '@gobletqa/components'
import { getRootPrefix } from '@utils/repo/getRootPrefix'

const getSubDir = (
  active:TExpPart,
  repo:TRepoOpts
) => {
  switch(active.kind){
    case ExpressionKinds.upload: {
      return repo?.paths?.uploadsDir || `artifacts/uploads`
    }
    case ExpressionKinds.download: {
      return repo?.paths?.downloadsDir || `artifacts/downloads`
    }
    default: {
      return repo?.paths?.repoRoot
    }
  }
}

const generateFileList = (ctx:TRaceMenuItemClickCtx) => {
  const { active, onChange } = ctx
  const { files, repo } = getStore().getState()

  const fullLoc = getRootPrefix(repo, getSubDir(active, repo))
  if(!fullLoc?.length) return []

  const locations = Object.keys(files.files)
  if(!locations?.length) return []

  return locations.reduce((acc, loc) => {
    if(!loc.includes(fullLoc)) return acc

    const cleaned = loc.replace(`${fullLoc}/`, ``)

    cleaned &&
      acc.push({
        key: cleaned,
        closeMenu: true,
        closeParent:true,
        children: (<ContextItem sx={{ minWidth: `150px` }} name={cleaned} />),
        onClick: () => onChange({target: { value: cleaned, tagName: `INPUT` }})
      })

    return acc
  }, [] as TMenuItem[])

}

export const FromFile:TRaceMenuItem = {
  closeMenu: false,
  text: `From File`,
  Icon: UploadFileIcon,
  id: `expression-from-file`,
  type: EAstObject.expression,
  filter: [
    ExpressionKinds.upload,
    ExpressionKinds.download,
  ],
  onClick: (ctx:TRaceMenuItemClickCtx, evt:MouseEvent<HTMLElement>) => {
    const { onSubmenu } = ctx
    onSubmenu(evt, {
      open: true,
      items: generateFileList(ctx)
    })
  }
}

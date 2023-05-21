import type { TRaceFeatureGroup } from '@GBR/types'

import { EPatchType } from '@GBR/types'
import {EmptyFeatureGroupUUID} from '@GBR/constants'
import { getEditor } from '@GBR/utils/editor/getEditor'
import { groupFactory } from '@GBR/factories/groupFactory'
import { renameGroup } from '@GBR/utils/features/renameGroup'
import { updateGroups } from '@GBR/utils/features/updateGroups'
import { getGroupData } from '@gobletqa/race/utils/features/getGroupData'

export type TSaveFeatureGroup = {
  featureGroup:TRaceFeatureGroup
}

export const saveFeatureGroup = async (props:TSaveFeatureGroup) => {
  const { featureGroup } = props
  const oldPath = featureGroup.path

  const { editor } = await getEditor()
  const {
    rootPrefix,
    getOpenedTabs,
    featureGroups,
    onFolderRename,
    onFolderCreate,
    setTabsAndGroups,
    } = editor

  const {
    path,
    title,
    relative,
  } = getGroupData({ path: ``, items: featureGroups }, featureGroup)

  const fullLoc = `${rootPrefix.replace(/\/$/, ``)}${path}`

  const group = groupFactory({
    path,
    title,
    fullLoc,
    uuid: fullLoc
  })

  const tabs = getOpenedTabs()
  const isNew = featureGroup.uuid === EmptyFeatureGroupUUID
  const updated = isNew
    ? updateGroups({
        oldPath,
        featureGroup: group,
        replaceEmptyKey: relative,
        parentGroup: { items: featureGroups },
      })
    : renameGroup({
        tabs,
        oldPath,
        featureGroup: group,
        parentGroup: { items: featureGroups },
      })

  isNew
    ? onFolderCreate?.(group)
    : onFolderRename?.(group, oldPath)

  return setTabsAndGroups(updated)

}
import type { TRaceFeatureGroup } from '@GBR/types'


import { getEditor } from '@GBR/utils/editor/getEditor'
import { groupFactory } from '@GBR/factories/groupFactory'
import { cleanString } from '@GBR/utils/helpers/cleanString'
import { updateGroups } from '@GBR/utils/features/updateGroups'
import { getGroupData } from '@gobletqa/race/utils/features/getGroupData'

export type TSaveNewFeatureGroup = {
  featureGroup:TRaceFeatureGroup
}

export const saveNewFeatureGroup = async (props:TSaveNewFeatureGroup) => {
  const { featureGroup } = props
  const { editor } = await getEditor()
  const {
    rootPrefix,
    featureGroups,
    onFolderCreate,
    setFeatureGroups,
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

  // call the on folder create callback to save it in the backend
  onFolderCreate?.(path)

  const updated = updateGroups({ items: featureGroups }, group, relative)

  return setFeatureGroups(updated.items)

}
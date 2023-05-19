import type { TRaceFeatureGroup } from '@GBR/types'


import { getEditor } from '@GBR/utils/editor/getEditor'
import { cleanString } from '@GBR/utils/helpers/cleanString'
import { getGroupLoc } from '@GBR/utils/features/getGroupLoc'
import { updateGroups } from '@GBR/utils/features/updateGroups'

export type TSaveNewFeatureGroup = {
  featureGroup:TRaceFeatureGroup
}

export const saveNewFeatureGroup = async (props:TSaveNewFeatureGroup) => {
  const { editor } = await getEditor()
  const { onFolderCreate, featureGroups, setFeatureGroups } = editor
  const { featureGroup } = props

  const loc = getGroupLoc({ path: ``, items: featureGroups }, featureGroup)
  onFolderCreate?.(loc)

  const title = loc.split(`/`).pop() as string
  const group = {
    title,
    items: {},
    path: loc,
    uuid: title,
  }

  const updated = updateGroups({ items: featureGroups }, group, true)

  return setFeatureGroups(updated.items)
}
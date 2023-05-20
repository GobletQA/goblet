import type { TRaceFeatureGroup } from '@GBR/types'

import { getEditor } from '@GBR/utils/editor/getEditor'
import { updateGroups } from '@GBR/utils/features/updateGroups'

export type TEditFeatureGroup = {
  editing?:boolean
  featureGroup:TRaceFeatureGroup
}

export const editFeatureGroupName = async (props:TEditFeatureGroup) => {

  const { featureGroup, editing=true } = props

  const { editor } = await getEditor()
  const { featureGroups, setFeatureGroups } = editor

  const updated = updateGroups(
    { items: featureGroups },
    {...featureGroup, editing }
  )

  return setFeatureGroups(updated.items)
}
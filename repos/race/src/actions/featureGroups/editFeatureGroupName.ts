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
  const { featureGroups, setFeatureRefs } = editor

  const updated = updateGroups(
    { items: featureGroups },
    {...featureGroup, editing }
  )

  return setFeatureRefs(updated.items)
}

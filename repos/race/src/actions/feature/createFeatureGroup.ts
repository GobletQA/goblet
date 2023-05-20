import type { TRaceFeatureGroup } from '@GBR/types'

import {EmptyFeatureGroupUUID} from '@GBR/constants'
import { getEditor } from '@GBR/utils/editor/getEditor'
import { updateGroups } from '@GBR/utils/features/updateGroups'

export type TCreateFeatureGroup = {
  featureGroup?:TRaceFeatureGroup
}

export const createFeatureGroup = async (props?:TCreateFeatureGroup) => {

  const { editor } = await getEditor()
  const { featureGroups, setFeatureGroups } = editor
  const featureGroup = props?.featureGroup

  const group = {
    title: ``,
    items: {},
    editing: true,
    type: `folder` as const,
    path: EmptyFeatureGroupUUID,
    uuid: EmptyFeatureGroupUUID,
    parent: {
      uuid: EmptyFeatureGroupUUID,
      location: EmptyFeatureGroupUUID
    }
  }

  if(!featureGroup){
    const items = {...featureGroups, [EmptyFeatureGroupUUID]: group}
    return setFeatureGroups(items)
  }

  const updated = updateGroups(
    { items: featureGroups },
    {...featureGroup, items: {...featureGroup.items, [EmptyFeatureGroupUUID]: group}}
  )

  return setFeatureGroups(updated.items)
}
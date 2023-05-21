import type { TRaceFeatureGroup } from '@GBR/types'

import { EPatchType } from '@GBR/types'
import {EmptyFeatureGroupUUID} from '@GBR/constants'
import { getEditor } from '@GBR/utils/editor/getEditor'
import { groupFactory } from '@GBR/factories/groupFactory'
import { updateGroups } from '@GBR/utils/features/updateGroups'

export type TCreateFeatureGroup = {
  featureGroup?:TRaceFeatureGroup
}

export const createFeatureGroup = async (props?:TCreateFeatureGroup) => {

  const { editor } = await getEditor()
  const { featureGroups, setTabsAndGroups, rootPrefix } = editor
  const featureGroup = props?.featureGroup


  const [loc, rootLoc] = featureGroup
    ? [featureGroup.path, featureGroup.uuid]
    : [``, rootPrefix]
  
  const relative = `/${EmptyFeatureGroupUUID}`
  const path = `${loc.replace(/\/$/, ``)}${relative}`
  const fullLoc = `${rootLoc.replace(/\/$/, ``)}${relative}`

  const group = groupFactory({
    path,
    fullLoc,
    title: ``,
    editing: true,
    uuid: EmptyFeatureGroupUUID
  })


  if(!featureGroup){
    const items = {...featureGroups, [relative]: group}
    return setTabsAndGroups(
      // { op: EPatchType.add, new: items },
      undefined,
      items
    )
  }

  const updated = updateGroups(
    { items: featureGroups },
    {...featureGroup, items: {...featureGroup.items, [relative]: group}}
  )

  return setTabsAndGroups(
    // { op: EPatchType.add, new: updated.items },
    undefined,
    updated.items
  )
}
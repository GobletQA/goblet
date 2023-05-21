import type { TRaceFeature } from '@GBR/types'

import { cleanString } from '@GBR/utils/helpers/cleanString'
import { addFeatureExt } from '@GBR/utils/features/generateFeatureProps'


export type TRenameFeatureProps = {
  oldName:string
  newName:string
  feature:TRaceFeature
}


export const renameFeatureProps = ({
  newName,
  oldName,
  feature
}:TRenameFeatureProps) => {

  const fileName = cleanString(newName)
  const nameExt = addFeatureExt(fileName)

  const path = feature.path.replace(oldName, nameExt)
  const fullLoc = feature.parent.location.replace(oldName, nameExt)

  return {
    path,
    uuid: fullLoc,
    parent: { uuid: fullLoc, location: fullLoc },
  }

}

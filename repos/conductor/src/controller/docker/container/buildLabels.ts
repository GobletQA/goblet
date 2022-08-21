import { exists } from '@keg-hub/jsutils'
import { TImgConfig , TContainerLabels} from '@gobletqa/conductor/types'
import {
  CONDUCTOR_LABEL,
  CONTAINER_LABELS,
  CONDUCTOR_USER_HASH_LABEL,
} from '../../../constants'

export const buildLabels = (image:TImgConfig, userHash:string):TContainerLabels => {
  return Object.entries(image?.container)
    .reduce((acc, [name, value]) => {
      CONTAINER_LABELS.includes(name)
        && exists(value)
        && (acc[`${CONDUCTOR_LABEL}.${name}`] = `${value}`)

      return acc  as Record<string,string>
    }, { [CONDUCTOR_USER_HASH_LABEL]: userHash } as TContainerLabels)
}
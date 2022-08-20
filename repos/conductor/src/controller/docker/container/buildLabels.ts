import { exists } from '@keg-hub/jsutils'
import { TImgConfig , TContainerLabels} from '@gobletqa/conductor/types'
import {
  CONDUCTOR_LABEL,
  CONTAINER_LABELS,
  CONDUCTOR_SUBDOMAIN_LABEL,
} from '../../../constants'

export const buildLabels = (image:TImgConfig, subdomain:string):TContainerLabels => {
  return Object.entries(image?.container)
    .reduce((acc, [name, value]) => {
      CONTAINER_LABELS.includes(name)
        && exists(value)
        && (acc[`${CONDUCTOR_LABEL}.${name}`] = `${value}`)

      return acc  as Record<string,string>
    }, { [CONDUCTOR_SUBDOMAIN_LABEL]: subdomain } as TContainerLabels)
}
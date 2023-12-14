import type { TImgConfig , TContainerLabels} from '@GCD/types'

import { exists } from '@keg-hub/jsutils/exists'
import {
  ConductorLabel,
  ContainerLabels,
  ConductorUserHashLabel,
} from '../../../constants'

export const buildLabels = (image:TImgConfig, userHash:string):TContainerLabels => {
  return Object.entries(image?.container)
    .reduce((acc, [name, value]) => {
      ContainerLabels.includes(name)
        && exists(value)
        && (acc[`${ConductorLabel}.${name}`] = `${value}`)

      return acc  as Record<string,string>
    }, { [ConductorUserHashLabel]: userHash } as TContainerLabels)
}
import { exists } from '@keg-hub/jsutils'
import { TImgConfig , TContainerLabels} from '@gobletqa/conductor/types'
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
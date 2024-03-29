import type { TImgConfig } from '@gobletqa/shared/types'

import path from 'path'
import { pickKeys } from '@keg-hub/jsutils/pickKeys'

export const buildImgUri = (image:TImgConfig, withKeys?:string[]) => {
  const hasKeys = Boolean(withKeys && withKeys.length)
  
  if(image.uri && !hasKeys) return image.uri

  const {
    user,
    name,
    provider,
    tag=`latest`,
  } = (hasKeys ? pickKeys(image, withKeys) : image)

  return `${path.join(...[provider, user, name].filter(Boolean))}:${tag}`
}
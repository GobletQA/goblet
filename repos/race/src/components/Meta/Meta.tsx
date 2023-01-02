import type { TEditingProps, TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Tags } from './Tags'
import { Desire } from './Desire'
import { Reason } from './Reason'
import { ESectionType } from '@GBR/types'
import { Perspective } from './Perspective'

export type TMeta = TEditingProps & {
  type:ESectionType
  parent:TRaceFeature
  featuresRef:TFeaturesRef
}

export const Meta = (props:TMeta) => {
  const { parent, type } = props
  
  return (
    <>
      <Tags {...props} />
      <Perspective {...props} />
      <Desire {...props} />
      <Reason {...props} />
    </>
  )
}
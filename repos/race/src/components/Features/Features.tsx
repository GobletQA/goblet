import type { TFeaturesRef } from '@GBR/types'

import { Tree } from '@gobletqa/components'
import { useFeatureGroups } from '@GBR/hooks'


export type TFeatures = {
  featuresRef: TFeaturesRef
}

export const Features = (props:TFeatures) => {
  
  const groups = useFeatureGroups(props)
  
  return (
    <Tree
      title='Features'
      groups={groups}
    />
  )
  
}

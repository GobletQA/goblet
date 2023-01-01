import type { TTabAction } from '@gobletqa/components'
import type { TFeaturesRefs, TRaceFeatures } from '@GBR/types'

import { useMemo } from 'react'
import { Panel } from '@gobletqa/components'
import { useFeature } from '@GBR/contexts'
import { FeaturesList } from './FeaturesList'
import { FeaturesActions } from './FeaturesActions'

export type TFeaturesPanel = TFeaturesRefs & {
  featureGroups:TRaceFeatures
  onActiveFeature: TTabAction
}

export const FeaturesPanel = (props:TFeaturesPanel) => {
  const {
    featureGroups,
    onActiveFeature,
  } = props

  const { feature:active, setFeature } = useFeature()

  const actions = useMemo(() => {
    return [
      {
        ...FeaturesActions[0],
        action: (e: Event) => {
          e.stopPropagation()
          
        },
      },
      {
        ...FeaturesActions[1],
        action: (e: Event) => {
          e.stopPropagation()
          
        }
      },
    ]
  }, [])

  return (
    <Panel
      header
      startOpen
      fillHeight
      title='Features'
      actions={actions}
    >
      <FeaturesList
        active={active}
        featureGroups={featureGroups}
        onActiveFeature={onActiveFeature}
      />
    </Panel>
  )
  
}
import type {
  TRaceFeatures,
  TEditorFeatureActions,
} from '@GBR/types'

import { useEditor } from '@GBR/contexts'
import { Panel } from '@gobletqa/components'
import { FeaturesList } from './FeaturesList'
import { FeaturesActions } from './FeaturesActions'

export type TFeaturesPanel = TEditorFeatureActions & {
  featureGroups:TRaceFeatures
}

export const FeaturesPanel = (props:TFeaturesPanel) => {
  const {
    editingName,
    featureGroups,
    onEditFeature,
    onDeleteFeature,
    onActiveFeature,
  } = props

  const { feature:active } = useEditor()

  return (
    <Panel
      header
      startOpen
      fillHeight
      title='Features'
      actions={FeaturesActions}
    >
      <FeaturesList
        active={active}
        editingName={editingName}
        featureGroups={featureGroups}
        onEditFeature={onEditFeature}
        onDeleteFeature={onDeleteFeature}
        onActiveFeature={onActiveFeature}
      />
    </Panel>
  )
  
}
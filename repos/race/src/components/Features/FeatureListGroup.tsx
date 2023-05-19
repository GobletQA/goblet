import type { CSSProperties } from 'react'
import type {
  TRaceFeature,
  TRaceFeatures,
  TRaceFeatureGroup,
  TEditorFeatureActions,
} from '@GBR/types'

import { wordCaps } from '@keg-hub/jsutils'
import { FeatureItemRender } from './FeatureItemRender'
import { FeatureGroupHeader } from './FeatureGroupHeader'
import { Dropdown, ExpandIcon } from '@gobletqa/components'
import { FeatureGroupEditingHeader } from './FeatureGroupEditingHeader'
import { FeaturesGroup, FeaturesGroupContainer } from './FeaturesList.styled'

export type TFeatureListGroup = TEditorFeatureActions & {
  active:TRaceFeature
  featureGroups:TRaceFeatures
  featureGroup:TRaceFeatureGroup
}

const styles = {
  header: {
    flexDirection: `row-reverse`,
    minHeight: `initial`,
  } as CSSProperties,
  headerContent: {
    alignItems: `center`,
    justifyContent: `space-between`,
  },
  body: {
    margin: `0px`,
  } as CSSProperties
}

export const FeatureListGroup = (props:TFeatureListGroup) => {

  const {
    active,
    editingName,
    featureGroup,
    featureGroups,
    onEditFeature,
    onDeleteFeature,
    onActiveFeature
  } = props

  return (
    <FeaturesGroup className='gb-race-features-list-group'>
      <Dropdown
        bodySx={styles.body}
        ExpandIcon={ExpandIcon}
        headerSx={styles.header}
        noToggle={featureGroup.editing}
        headerContentSx={styles.headerContent}
        className='gb-race-features-list-dropdown'
        id={`${featureGroup.title}-dropdown`}
        Header={
          featureGroup.editing
            ? (
                <FeatureGroupEditingHeader
                  featureGroup={featureGroup}
                  featureGroups={featureGroups}
                />
              )
            : (
                <FeatureGroupHeader
                  featureGroup={featureGroup}
                  featureGroups={featureGroups}
                  text={wordCaps(featureGroup.title)}
                />
              )
        }
      >
        <FeaturesGroupContainer>
          <FeatureItemRender
            active={active}
            editingName={editingName}
            onEditFeature={onEditFeature}
            featureGroups={featureGroups}
            onDeleteFeature={onDeleteFeature}
            onActiveFeature={onActiveFeature}
            featureGroup={featureGroup.items}
          />
        </FeaturesGroupContainer>
      </Dropdown>
    </FeaturesGroup>
  )
}
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
import { FeaturesGroup, FeaturesGroupContainer } from './FeaturesList.styled'
import { useFeatureGroupHooks } from '@GBR/hooks/features/useFeatureGroupHooks'

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
    featureGroup,
    featureGroups,
    onEditFeature,
    onDeleteFeature,
    onActiveFeature
  } = props

  const {
    onBlur,
    editing,
    nameRef,
    onKeyDown,
    onEditName,
    onAddFolder,
    editingName,
    onDeleteGroup,
    onCreateFeature,
  } = useFeatureGroupHooks(props)

  return (
    <FeaturesGroup className='gb-race-features-list-group'>
      <Dropdown
        bodySx={styles.body}
        ExpandIcon={ExpandIcon}
        headerSx={styles.header}
        headerContentSx={styles.headerContent}
        className='gb-race-features-list-dropdown'
        id={`${featureGroup.title}-dropdown`}
        Header={(
          <FeatureGroupHeader
            onBlur={onBlur}
            editing={editing}
            nameRef={nameRef}
            onKeyDown={onKeyDown}
            onEditName={onEditName}
            onAddSubFolder={onAddFolder}
            onDeleteGroup={onDeleteGroup}
            onCreateFeature={onCreateFeature}
            text={wordCaps(featureGroup.title)}
          />
        )}
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
import type { CSSProperties } from 'react'
import type {
  TRaceFeature,
  TRaceFeatures,
  TRaceFeatureGroup,
  TEditorFeatureActions,
} from '@GBR/types'

import { wordCaps } from '@keg-hub/jsutils'
import { useCallback, useRef, useState } from 'react'
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
    setEditing,
    editingName,
  } = useFeatureGroupHooks(props)

  return (
    <FeaturesGroup className='gb-features-list-group'>
      <Dropdown
        bodySx={styles.body}
        ExpandIcon={ExpandIcon}
        headerSx={styles.header}
        id={`${featureGroup.title}-dropdown`}
        Header={(
          <FeatureGroupHeader
            onBlur={onBlur}
            editing={editing}
            nameRef={nameRef}
            onKeyDown={onKeyDown}
            setEditing={setEditing}
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
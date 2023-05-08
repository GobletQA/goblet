import type { CSSProperties } from 'react'
import type {
  TRaceFeature,
  TRaceFeatureGroup,
  TEditorFeatureActions,
} from '@GBR/types'

import { useCallback } from 'react'
import { wordCaps } from '@keg-hub/jsutils'
import { Dropdown, ExpandIcon } from '@gobletqa/components'
import { FeatureItemRender } from './FeatureItemRender'
import { FeaturesGroup, FeaturesGroupContainer } from './FeaturesList.styled'

export type TFeatureListGroup = TEditorFeatureActions & {
  active:TRaceFeature
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
    onEditFeature,
    onDeleteFeature,
    onActiveFeature
  } = props

  const onClick = useCallback(() => {
    
    
  }, [])

  return (
    <FeaturesGroup className='gb-features-list-group'>
      <Dropdown
        bodySx={styles.body}
        ExpandIcon={ExpandIcon}
        headerSx={styles.header}
        id={`${featureGroup.title}-dropdown`}
        headerText={wordCaps(featureGroup.title)}
      >
        <FeaturesGroupContainer>
          <FeatureItemRender
            active={active}
            onEditFeature={onEditFeature}
            onDeleteFeature={onDeleteFeature}
            onActiveFeature={onActiveFeature}
            featureGroup={featureGroup.items}
          />
        </FeaturesGroupContainer>
      </Dropdown>
    </FeaturesGroup>
  )
}
import type { TTabAction } from '@gobletqa/components'
import type { TRaceFeature, TRaceFeatureGroup } from '@GBR/types'
import type { CSSProperties } from 'react'

import { useCallback } from 'react'
import { wordCaps } from '@keg-hub/jsutils'
import { Dropdown, ExpandIcon } from '@gobletqa/components'
import { FeatureItemRender } from './FeatureItemRender'
import { FeaturesGroup, FeaturesGroupContainer } from './FeaturesList.styled'

export type TFeatureListGroup = {
  active:TRaceFeature
  onActiveFeature: TTabAction
  featureGroup: TRaceFeatureGroup
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
    onActiveFeature
  } = props

  const onClick = useCallback(() => {
    
    
  }, [])

  return (
    <FeaturesGroup className='gr-features-list-group'>
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
            onActiveFeature={onActiveFeature}
            featureGroup={featureGroup.items}
          />
        </FeaturesGroupContainer>
      </Dropdown>
    </FeaturesGroup>
  )
}
import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Tags } from '../Tags'
import { Title } from './Title'
import { Section } from '../Section'
import { ESectionType } from '@GBR/types'
import { Container, Dropdown } from '../Shared'
import { gutter } from '@gobletqa/components'

export type TFeatureMeta = {
  parent:TRaceFeature
  featuresRef: TFeaturesRef
}

const styles = {
  header: {},
  section: {
    paddingRight: gutter.padding.hpx,
  },
  container: {},
  headerText: {},
  headerContent: {},
}

export const Meta = (props:TFeatureMeta) => {
  
  const {
    parent,
    featuresRef,
  } = props

  return (
    <Container
      elevation={0}
      sx={styles.container}
      className='gr-feature-meta-container'
    >
      <Dropdown
        id={parent.uuid}
        initialExpand={true}
        headerText={`GENERAL`}
        headerSx={styles.header}
        headerTextSx={styles.headerText}
        className='gr-user-story-dropdown'
        headerContentSx={styles.headerContent}
      >
        <Section
          stack={2}
          sx={styles.section}
          type={ESectionType.feature}
        >
          <Title
            parent={parent}
            featuresRef={featuresRef}
          />
          <Tags
            parent={parent}
            featuresRef={featuresRef}
            type={ESectionType.feature}
          />
        </Section>
      </Dropdown>
    </Container>
  )
  
}
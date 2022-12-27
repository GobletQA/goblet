import type { TRaceEditorProps } from '@GBR/types'

import { Builder } from '../Builder'
import { Sidebar } from '../../goblet'
import { FeaturesPanel } from '../Features'
import { Container, Divider } from './RaceEditor.styled'
import { useRaceEditor } from '../../hooks/useRaceEditor'
import { FeatureProvider } from '../../contexts/FeatureContext'

export const RaceEditor = (props:TRaceEditorProps) => {
  const { feature, firstFeatureActive } = props
  const {
    stepsRef,
    featuresRef,
    onFeatureChangeRef,
    onFeatureUpdateRef,
    onFeatureBeforeChangeRef
  } = useRaceEditor(props)

  return (
    <FeatureProvider
      onFeatureChangeRef={onFeatureChangeRef}
      onFeatureUpdateRef={onFeatureUpdateRef}
      onFeatureBeforeChangeRef={onFeatureBeforeChangeRef}
      initialFeature={feature || firstFeatureActive ? Object.values(featuresRef?.current)?.[0] : undefined}
    >
      <Container className='goblet-race-editor'>
        <Sidebar>
          <FeaturesPanel
            stepsRef={stepsRef}
            featuresRef={featuresRef}
          />
        </Sidebar>
        <Divider className='goblet-race-divider' />
        <Builder
          stepsRef={stepsRef}
          featuresRef={featuresRef}
        />
      </Container>
    </FeatureProvider>
  )
}


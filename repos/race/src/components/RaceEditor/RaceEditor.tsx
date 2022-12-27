import type { TRaceEditorProps } from '@GBR/types'

import { Builder } from '../Builder'
import { Sidebar } from '../../goblet'
import { FeaturesPanel } from '../Features'
import { useSidebarResize } from '../../goblet'
import { useRaceEditor } from '../../hooks/useRaceEditor'
import { FeatureProvider } from '../../contexts/FeatureContext'
import { Container, Divider as REDivider } from './RaceEditor.styled'

export const RaceEditor = (props:TRaceEditorProps) => {
  const {
    feature,
    sidebarWidth,
    sidebarStatus,
    onSidebarResize,
    Divider=REDivider,
    firstFeatureActive
  } = props

  const {
    styles,
    onMove,
    onMoveEnd,
    onMoveStart,
    resizeSidebar,
  } = useSidebarResize({
    onSidebarResize,
    initialWidth: sidebarWidth,
    initialStatus: sidebarStatus,
  })

  const {
    stepsRef,
    featuresRef,
    onFeatureChangeRef,
    onFeatureUpdateRef,
    onFeatureBeforeChangeRef
  } = useRaceEditor(props, {
    resizeSidebar
  })


  return (
    <FeatureProvider
      onFeatureChangeRef={onFeatureChangeRef}
      onFeatureUpdateRef={onFeatureUpdateRef}
      onFeatureBeforeChangeRef={onFeatureBeforeChangeRef}
      initialFeature={
        feature || firstFeatureActive ? Object.values(featuresRef?.current)?.[0] : undefined
      }
    >
      <Container
        onMouseMove={onMove}
        onMouseUp={onMoveEnd}
        className='goblet-race-editor'
      >
        <Sidebar style={styles} >
          <FeaturesPanel
            stepsRef={stepsRef}
            featuresRef={featuresRef}
          />
        </Sidebar>
        <Divider onMouseDown={onMoveStart} className='goblet-editor-drag' />
        <Builder
          stepsRef={stepsRef}
          featuresRef={featuresRef}
        />
      </Container>
    </FeatureProvider>
  )
}


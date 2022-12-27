import type { TRaceEditorProps } from '@GBR/types'

import { useRef } from 'react'
import { Builder } from '../Builder'
import { Sidebar } from '../../goblet'
import { FeaturesPanel } from '../Features'
import { useRaceEditor } from '../../hooks/useRaceEditor'
import { FeatureProvider } from '../../contexts/FeatureContext'
import { Container, Divider as REDivider } from './RaceEditor.styled'
import { useSidebarResize, Actions, OpenedTabs } from '../../goblet'

export const RaceEditor = (props:TRaceEditorProps) => {
  const {
    Panels,
    feature,
    actions,
    PrePanels,
    defaultPath,
    actionsOpen,
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


  // TODO: add real values for these
  const editorRef = useRef(null)
  const curPathRef = useRef(defaultPath || '')
  const curValueRef = useRef('')

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
        <Sidebar
          style={styles}
          Panels={Panels}
          PrePanels={PrePanels}
        >
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
        {actions?.length && (
          <Actions
            actions={actions}
            open={actionsOpen}
            editorRef={editorRef}
            curPathRef={curPathRef}
            curValueRef={curValueRef}
          />
        )}
      </Container>
    </FeatureProvider>
  )
}


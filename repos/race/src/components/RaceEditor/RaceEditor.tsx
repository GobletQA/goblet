import type { TRaceEditorProps } from '@GBR/types'

import { Sidebar } from '../../goblet'
import { Feature } from '../Feature'
import { FeaturesPanel } from '../Features'
import { useRaceEditor } from '../../hooks/useRaceEditor'
import { FeatureProvider } from '../../contexts/FeatureContext'
import { useSidebarResize, Actions, OpenedTabs } from '../../goblet'
import {
  Container,
  BuilderContainer,
  Divider as REDivider
} from './RaceEditor.styled'

export const RaceEditor = (props:TRaceEditorProps) => {
  const {
    Panels,
    feature,
    actions,
    PrePanels,
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
    editorRef,
    curPathRef,
    curValueRef,
    featuresRef,
    onFeatureChangeRef,
    onFeatureUpdateRef,
    onFeatureBeforeChangeRef,
    onTabClick,
    onTabHover,
    onTabLeave,
    onTabDown,
    onTabClose,
    openedTabs,
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
        <BuilderContainer>
          <OpenedTabs
            onTabDown={onTabDown}
            onTabClick={onTabClick}
            onTabHover={onTabHover}
            onTabLeave={onTabLeave}
            onTabClose={onTabClose}
            openedTabs={openedTabs}
          />
          <Feature />
        </BuilderContainer>
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


import type {
  TEditorRefs,
  TFeaturesRefs,
  TEditorContainer,
  TOnFeatureCBRef,
  TRaceEditorProps
} from '@GBR/types'

import { Feature } from '../Feature'
import { FeaturesPanel } from '../Features'
import { useOpenedTabs } from '../../hooks/useOpenedTabs'
import { useSidebarResize, Actions, OpenedTabs, Sidebar } from '@gobletqa/components'
import {
  Container,
  BuilderContainer,
  Divider as REDivider
} from './RaceEditor.styled'

export const EditorContainer = (props:TEditorContainer) => {

  const {
    Panels,
    actions,
    PrePanels,
    stepsRef,
    editorRef,
    curPathRef,
    curValueRef,
    featuresRef,
    actionsOpen,
    sidebarWidth,
    sidebarStatus,
    sidebarMaxWidth,
    onSidebarResize,
    Divider=REDivider,
    onFeatureCloseRef,
    onFeatureActiveRef,
  } = props

  const {
    styles,
    onMove,
    maxWidth,
    onMoveEnd,
    onMoveStart,
  } = useSidebarResize({
    onSidebarResize,
    maxWidth: sidebarMaxWidth,
    initialWidth: sidebarWidth,
    initialStatus: sidebarStatus,
  })

  const {
    onTabHover,
    onTabLeave,
    onTabDown,
    openedTabs,
    onCloseFeature,
    onActiveFeature,
  } = useOpenedTabs(props, {
    onFeatureCloseRef,
    onFeatureActiveRef,
  })

  return (

      <Container
        onMouseMove={onMove}
        onMouseUp={onMoveEnd}
        className='gr-editor'
      >
        <Sidebar
          style={styles}
          Panels={Panels}
          maxWidth={maxWidth}
          PrePanels={PrePanels}
        >
          <FeaturesPanel
            stepsRef={stepsRef}
            featuresRef={featuresRef}
            onActiveFeature={onActiveFeature}
          />
        </Sidebar>
        <Divider onMouseDown={onMoveStart} className='gr-editor-drag' />
        <BuilderContainer>
          <OpenedTabs
            onTabDown={onTabDown}
            onTabHover={onTabHover}
            onTabLeave={onTabLeave}
            openedTabs={openedTabs}
            onTabClose={onCloseFeature}
            onTabClick={onActiveFeature}
          />
          <Feature
            stepsRef={stepsRef}
            featuresRef={featuresRef}
          />
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
  )
}


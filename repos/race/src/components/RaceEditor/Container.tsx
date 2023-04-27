import type { TEditorContainer } from '@GBR/types'

import { Sidebar } from '@GBR/components/Sidebar'
import { Feature } from '@GBR/components/Feature'
import { Modal } from '@GBR/components/Modals/Modal'
import { FeaturesPanel } from '@GBR/components/Features'
import { useTabCallbacks } from '@GBR/hooks/tabs/useTabCallbacks'
import {
  EditorContainer,
  Divider as REDivider,
  Container as ContainerComp,
} from './RaceEditor.styled'
import {
  Alert,
  OpenedTabs,
  EditorActions,
  useSidebarResize,
} from '@gobletqa/components'

export const Container = (props:TEditorContainer) => {

  const {
    portal,
    Panels,
    actions,
    PrePanels,
    editorRef,
    onKeyDown,
    curPathRef,
    curValueRef,
    stepDefsRef,
    featuresRef,
    openedTabs,
    containerRef,
    actionsOpen,
    sidebarWidth,
    sidebarStatus,
    setOpenedTabs,
    featureGroups,
    onFeatureClose,
    onFeatureActive,
    sidebarMaxWidth,
    onSidebarResize,
    onFeatureInactive,
    Divider=REDivider,
  } = props

  const {
    onTabDown,
    onTabHover,
    onTabLeave,
    onCloseFeature,
    onActiveFeature,
  } = useTabCallbacks({
    openedTabs,
    featuresRef,
    setOpenedTabs,
    onFeatureClose,
    onFeatureActive,
    onFeatureInactive,
    onTabDown: props.onTabDown,
    onTabLeave: props.onTabLeave,
    onTabHover: props.onTabHover,
  })

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

  return (

      <ContainerComp
        tabIndex={1}
        ref={containerRef}
        onMouseMove={onMove}
        onMouseUp={onMoveEnd}
        onKeyDown={onKeyDown}
        className='goblet-editor gb-race-editor-container'
      >

        <Sidebar
          style={styles}
          Panels={Panels}
          portal={portal}
          maxWidth={maxWidth}
          PrePanels={PrePanels}
        >
          <FeaturesPanel
            stepDefsRef={stepDefsRef}
            featuresRef={featuresRef}
            featureGroups={featureGroups}
            onActiveFeature={onActiveFeature}
          />
        </Sidebar>

        <Divider onMouseDown={onMoveStart} className='gb-editor-drag' />
        <EditorContainer className='gb-race-editor-area'>
          <OpenedTabs
            onTabDown={onTabDown}
            onTabHover={onTabHover}
            onTabLeave={onTabLeave}
            openedTabs={openedTabs}
            onTabClose={onCloseFeature}
            onTabClick={onActiveFeature}
          />
          <Feature
            stepDefsRef={stepDefsRef}
            featuresRef={featuresRef}
          />
        </EditorContainer>
        <Modal />
        {actions?.length && (
          <EditorActions
            actions={actions}
            open={actionsOpen}
            editorRef={editorRef}
            curValueRef={curValueRef}
            curPath={curPathRef.current}
          />
        )}
        <Alert />
      </ContainerComp>
  )
}


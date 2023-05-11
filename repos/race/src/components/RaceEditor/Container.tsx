import type { TTabAction } from '@gobletqa/components'
import type { TOnActiveFeature, TEditorContainer } from '@GBR/types'

import { Sidebar } from '@GBR/components/Sidebar'
import { Feature } from '@GBR/components/Feature'
import { Modal } from '@GBR/components/Modals/Modal'
import { FeaturesPanel } from '@GBR/components/Features'
import { useEditorActions } from '@GBR/hooks/editor/useEditorActions'
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
    sidebarMaxWidth,
    onSidebarResize,
    Divider=REDivider,
  } = props

  const {
    onTabDown,
    onTabHover,
    onTabLeave,
    onTabClose,
    editingName,
    onEditFeature,
    onFeatureClick,
    onDeleteFeature,
  } = useEditorActions(props)

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
            editingName={editingName}
            stepDefsRef={stepDefsRef}
            featuresRef={featuresRef}
            featureGroups={featureGroups}
            onEditFeature={onEditFeature}
            onDeleteFeature={onDeleteFeature} 
            onActiveFeature={onFeatureClick as TOnActiveFeature}
          />
        </Sidebar>

        <Divider onMouseDown={onMoveStart} className='gb-editor-drag' />
        <EditorContainer className='gb-race-editor-area'>
          <OpenedTabs
            onTabDown={onTabDown}
            onTabHover={onTabHover}
            onTabLeave={onTabLeave}
            openedTabs={openedTabs}
            onTabClose={onTabClose}
            featuresRef={featuresRef}
            setOpenedTabs={setOpenedTabs}
            onTabClick={onFeatureClick as TTabAction}
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


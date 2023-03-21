import type { TEditorContainer } from '@GBR/types'

import { Sidebar } from '../Sidebar'
import { Feature } from '../Feature'
import { FeaturesPanel } from '../Features'
import { useTabCallbacks } from '@gobletqa/race/hooks/tabs/useTabCallbacks'
import { useSidebarResize, EditorActions, OpenedTabs } from '@gobletqa/components'
import {
  EditorContainer,
  Divider as REDivider,
  Container as ContainerComp,
} from './RaceEditor.styled'

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
        tabIndex={0}
        ref={containerRef}
        onMouseMove={onMove}
        onMouseUp={onMoveEnd}
        onKeyDown={onKeyDown}
        className='gb-race-editor'
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
        {actions?.length && (
          <EditorActions
            actions={actions}
            open={actionsOpen}
            editorRef={editorRef}
            curValueRef={curValueRef}
            curPath={curPathRef.current}
          />
        )}
      </ContainerComp>
  )
}


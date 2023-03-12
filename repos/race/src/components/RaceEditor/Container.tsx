import type { TEditorContainer } from '@GBR/types'

import { Sidebar } from '../Sidebar'
import { Feature } from '../Feature'
import { FeaturesPanel } from '../Features'
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
    onTabDown,
    openedTabs,
    onTabLeave,
    onTabHover,
    curPathRef,
    curValueRef,
    stepDefsRef,
    featuresRef,
    actionsOpen,
    sidebarWidth,
    sidebarStatus,
    featureGroups,
    onCloseFeature,
    onActiveFeature,
    sidebarMaxWidth,
    onSidebarResize,
    Divider=REDivider,
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

  return (

      <ContainerComp
        onMouseMove={onMove}
        onMouseUp={onMoveEnd}
        className='gb-editor'
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


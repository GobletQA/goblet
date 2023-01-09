import type { TEditorContainer } from '@GBR/types'

import { Feature } from '../Feature'
import { FeaturesPanel } from '../Features'
import { useSidebarResize, Actions, OpenedTabs, Sidebar } from '@gobletqa/components'
import {
  EditorContainer,
  Divider as REDivider,
  Container as ContainerComp,
} from './RaceEditor.styled'

export const Container = (props:TEditorContainer) => {

  const {
    Panels,
    actions,
    PrePanels,
    stepsRef,
    editorRef,
    onTabDown,
    openedTabs,
    onTabLeave,
    onTabHover,
    curPathRef,
    curValueRef,
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
            featureGroups={featureGroups}
            onActiveFeature={onActiveFeature}
          />
        </Sidebar>
        <Divider onMouseDown={onMoveStart} className='gr-editor-drag' />
        <EditorContainer className='goblet-editor-area'>
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
        </EditorContainer>
        {actions?.length && (
          <Actions
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


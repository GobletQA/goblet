import type { TRaceFeature, TRaceEditorProps } from '@GBR/types'

import { Container } from './Container'
import { EditorProvider } from '@GBR/contexts'
import { useRaceTheme } from '../../hooks/useRaceTheme'
import { useRaceEditor } from '../../hooks/useRaceEditor'

export const Editor = (props:TRaceEditorProps) => {

  useRaceTheme(props)

  const {
    stepsRef,
    onTabDown,
    editorRef,
    openedTabs,
    onTabHover,
    onTabLeave,
    curPathRef,
    curValueRef,
    featuresRef,
    featureGroups,
    onFeatureClose,
    updateEmptyTab,
    setFeatureRefs,
    onCloseFeature,
    onActiveFeature,
    onFeatureChange,
    setFeatureGroups,
    onFeatureActive,
    onFeatureInactive,
    onBeforeFeatureChange,
  } = useRaceEditor(props)

  return (
    <EditorProvider
      featuresRef={featuresRef}
      rootPrefix={props.rootPrefix}
      updateEmptyTab={updateEmptyTab}
      onFeatureClose={onFeatureClose}
      setFeatureRefs={setFeatureRefs}
      onFeatureChange={onFeatureChange}
      onFeatureActive={onFeatureActive}
      setFeatureGroups={setFeatureGroups}
      onFeatureInactive={onFeatureInactive}
      onBeforeFeatureChange={onBeforeFeatureChange}
    >
      <Container
        stepsRef={stepsRef}
        onTabDown={onTabDown}
        editorRef={editorRef}
        openedTabs={openedTabs}
        onTabHover={onTabHover}
        onTabLeave={onTabLeave}
        curPathRef={curPathRef}
        curValueRef={curValueRef}
        featuresRef={featuresRef}
        featureGroups={featureGroups}
        onCloseFeature={onCloseFeature}
        onActiveFeature={onActiveFeature}
        Panels={props.Panels}
        Divider={props.Divider}
        actions={props.actions}
        PrePanels={props.PrePanels}
        actionsOpen={props.actionsOpen}
        sidebarWidth={props.sidebarWidth}
        sidebarStatus={props.sidebarStatus}
        sidebarMaxWidth={props.sidebarMaxWidth}
        onSidebarResize={props.onSidebarResize}
      />
    </EditorProvider>
  )
}



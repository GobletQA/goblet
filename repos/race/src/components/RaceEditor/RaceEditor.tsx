import type { TRaceEditorProps } from '@GBR/types'

import { FeatureProvider } from '@GBR/contexts'
import { EditorContainer } from './EditorContainer'
import { useRaceRefs } from '../../hooks/useRaceRefs'
import { useRaceTheme } from '../../hooks/useRaceTheme'
import { useInitialFeature } from '../../hooks/useInitialFeature'


export const RaceEditor = (props:TRaceEditorProps) => {

  useRaceTheme(props)
  const initialFeature = useInitialFeature(props)

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
    setFeatureRefs,
    onCloseFeature,
    onActiveFeature,
    onFeatureChange,
    setFeatureGroups,
    onFeatureActive,
    onFeatureInactive,
    onBeforeFeatureChange,
  } = useRaceRefs(props, { initialFeature })

  return (
    <FeatureProvider
      featuresRef={featuresRef}
      rootPrefix={props.rootPrefix}
      onFeatureClose={onFeatureClose}
      initialFeature={initialFeature}
      setFeatureRefs={setFeatureRefs}
      onFeatureChange={onFeatureChange}
      onFeatureActive={onFeatureActive}
      setFeatureGroups={setFeatureGroups}
      onFeatureInactive={onFeatureInactive}
      onBeforeFeatureChange={onBeforeFeatureChange}
    >
      <EditorContainer
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
    </FeatureProvider>
  )
}




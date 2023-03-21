import type { TRaceEditorProps } from '@GBR/types'

import { Container } from './Container'
import { EditorProvider } from '@GBR/contexts'
import { useRaceTheme } from '@GBR/hooks/useRaceTheme'
import { useRaceEditor } from '@GBR/hooks/useRaceEditor'
import { useContainerHooks } from '@GBR/hooks/editor/useContainerHooks'

export const Editor = (props:TRaceEditorProps) => {

  useRaceTheme(props)


  const {
    onKeyDown,
    editorRef,
    curPathRef,
    openedTabs,
    curValueRef,
    stepDefsRef,
    featuresRef,
    containerRef,
    menuContext,
    setOpenedTabs,
    featureGroups,
    onFeatureSave,
    updateEmptyTab,
    onFeatureClose,
    setFeatureRefs,
    onFeatureChange,
    setFeatureGroups,
    onFeatureActive,
    onFeatureInactive,
  } = useRaceEditor(props)

  return (
    <EditorProvider
      curPathRef={curPathRef}
      curValueRef={curValueRef}
      featuresRef={featuresRef}
      menuContext={menuContext}
      rootPrefix={props.rootPrefix}
      onFeatureSave={onFeatureSave}
      onFeatureClose={onFeatureClose}
      updateEmptyTab={updateEmptyTab}
      setFeatureRefs={setFeatureRefs}
      onFeatureChange={onFeatureChange}
      onFeatureActive={onFeatureActive}
      setFeatureGroups={setFeatureGroups}
      onFeatureInactive={onFeatureInactive}
    >
      <Container
        onKeyDown={onKeyDown}
        editorRef={editorRef}
        openedTabs={openedTabs}
        curPathRef={curPathRef}
        curValueRef={curValueRef}
        featuresRef={featuresRef}
        stepDefsRef={stepDefsRef}
        containerRef={containerRef}
        featureGroups={featureGroups}
        setOpenedTabs={setOpenedTabs}
        onFeatureClose={onFeatureClose}
        portal={props.portal}
        Panels={props.Panels}
        Divider={props.Divider}
        actions={props.actions}
        PrePanels={props.PrePanels}
        onTabDown={props.onTabDown}
        onTabHover={props.onTabHover}
        onTabLeave={props.onTabLeave}
        actionsOpen={props.actionsOpen}
        sidebarWidth={props.sidebarWidth}
        sidebarStatus={props.sidebarStatus}
        sidebarMaxWidth={props.sidebarMaxWidth}
        onSidebarResize={props.onSidebarResize}
      />
    </EditorProvider>
  )
}




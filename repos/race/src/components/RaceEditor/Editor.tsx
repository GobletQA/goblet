import type { TRaceEditorProps } from '@GBR/types'

import { Container } from './Container'
import { EEditorMode } from '@GBR/types'
import { EditorProvider } from '@GBR/contexts'
import { useRaceTheme } from '@GBR/hooks/useRaceTheme'
import { useRaceEditor } from '@GBR/hooks/useRaceEditor'

export const Editor = (props:TRaceEditorProps) => {

  useRaceTheme()

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
    onFolderCreate,
    onFeatureClose,
    setFeatureRefs,
    onFeatureChange,
    onFeatureCreate,
    onFeatureDelete,
    onFeatureActive,
    setFeatureGroups,
    onFeatureInactive,
  } = useRaceEditor(props)

  return (
    <EditorProvider
      editorRef={editorRef}
      openedTabs={openedTabs}
      curPathRef={curPathRef}
      curValueRef={curValueRef}
      featuresRef={featuresRef}
      menuContext={menuContext}
      rootPrefix={props.rootPrefix}
      onFeatureSave={onFeatureSave}
      setOpenedTabs={setOpenedTabs}
      onFeatureClose={onFeatureClose}
      onFolderCreate={onFolderCreate}
      updateEmptyTab={updateEmptyTab}
      setFeatureRefs={setFeatureRefs}
      onFeatureCreate={onFeatureCreate}
      onFeatureChange={onFeatureChange}
      onFeatureActive={onFeatureActive}
      onFeatureDelete={onFeatureDelete}
      setFeatureGroups={setFeatureGroups}
      onFeatureInactive={onFeatureInactive}
      expressionOptions={props.expressionOptions}
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
        setFeatureRefs={setFeatureRefs}
        onFeatureDelete={onFeatureDelete}
        onFeatureActive={onFeatureActive}
        onFeatureInactive={onFeatureInactive}
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




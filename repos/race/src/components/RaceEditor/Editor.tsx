import type { TRaceEditorProps } from '@GBR/types'

import { Container } from './Container'
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
    menuContext,
    containerRef,
    setOpenedTabs,
    featureGroups,
    onFeatureSave,
    updateEmptyTab,
    onFeatureClose,
    onFeatureChange,
    onFeatureRename,
    onFeatureCreate,
    onFeatureDelete,
    onFeatureActive,
    setFeatureGroups,
    setTabsAndGroups,
    onFeatureInactive,
  } = useRaceEditor(props)

  return (
    <EditorProvider
      editorRef={editorRef}
      openedTabs={openedTabs}
      curPathRef={curPathRef}
      curValueRef={curValueRef}
      menuContext={menuContext}
      featureGroups={featureGroups}
      rootPrefix={props.rootPrefix}
      onFeatureSave={onFeatureSave}
      setOpenedTabs={setOpenedTabs}
      onFeatureClose={onFeatureClose}
      updateEmptyTab={updateEmptyTab}
      onFeatureCreate={onFeatureCreate}
      onFeatureChange={onFeatureChange}
      onFeatureActive={onFeatureActive}
      onFeatureDelete={onFeatureDelete}
      onFeatureRename={onFeatureRename}
      setTabsAndGroups={setTabsAndGroups}
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
        containerRef={containerRef}
        featureGroups={featureGroups}
        setOpenedTabs={setOpenedTabs}
        onFeatureClose={onFeatureClose}
        onFeatureDelete={onFeatureDelete}
        onFeatureActive={onFeatureActive}
        setFeatureGroups={setFeatureGroups}
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




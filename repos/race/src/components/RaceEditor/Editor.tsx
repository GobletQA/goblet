import type { TRaceInternal } from '@GBR/types'

import { Container } from './Container'
import { EditorProvider, DecorationsProvider } from '@GBR/contexts'

import { useRaceTheme } from '@GBR/hooks/useRaceTheme'
import { useRaceSetup } from '@gobletqa/race/hooks/useRaceSetup'

export const Editor = (props:TRaceInternal) => {

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
    getOpenedTabs,
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
  } = useRaceSetup(props)

  return (
    <EditorProvider
      editorRef={editorRef}
      openedTabs={openedTabs}
      curPathRef={curPathRef}
      curValueRef={curValueRef}
      menuContext={menuContext}
      getOpenedTabs={getOpenedTabs}
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
      stepActions={props.stepActions}
      ruleActions={props.ruleActions}
      featureActions={props.featureActions}
      scenarioActions={props.scenarioActions}
      backgroundActions={props.backgroundActions}
    >
      <DecorationsProvider decoRef={props.decoRef} >
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
      </DecorationsProvider>
    </EditorProvider>
  )
}




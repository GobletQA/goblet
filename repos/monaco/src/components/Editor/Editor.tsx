import type {
  TEditorAction,
  IMultiRefType,
  TEditorConfig,
  IMonacoEditorProps,
} from '@GBM/types'

import { setTheme } from '@GBM/init/setTheme'
import { Sidebar } from '@GBM/components/Sidebar'
import { useTabs } from '@GBM/hooks/tabs/useTabs'
import { useRef, useState, forwardRef } from 'react'
import { deleteModel } from '@GBM/utils/editor/deleteModel'
import { useEditorRefs } from '@GBM/hooks/editor/useEditorRefs'
import { useEditorSetup } from '@GBM/hooks/editor/useEditorSetup'
import { useModalActions } from '@GBM/hooks/editor/useModalActions'
import { useEditorFileTree } from '@GBM/hooks/editor/useEditorFileTree'
import { useFolderCallbacks } from '@GBM/hooks/editor/useFolderCallbacks'
import { useEditorCallbacks } from '@GBM/hooks/editor/useEditorCallbacks'
import { useEditorFileCallbacks } from '@GBM/hooks/editor/useEditorFileCallbacks'
import {
  Editor,
  Container,
  EditorContainer,
  Divider as REDivider,
} from './Editor.styled'
import {
  FileIcon,
  OpenedTabs,
  EmptyEditor,
  EditorActions,
  useSidebarResize,
} from '@gobletqa/components'

const editorStyles = { flex: 1, width: `100%` }

export const MonacoEditor = forwardRef<IMultiRefType, IMonacoEditorProps>((props, ref) => {

  const {
    style,
    portal,
    Panels,
    options,
    actions,
    PrePanels,
    emptyText,
    onLoadFile,
    onAddFile,
    onSaveFile,
    openedPaths,
    actionsOpen,
    onDeleteFile,
    onRenameFile,
    onPathChange,
    onFileChange,
    onValueChange,
    rootPrefix=``,
    sidebarWidth,
    sidebarStatus,
    onEditorLoaded,
    Modal:ModalComp,
    onSidebarResize,
    onBeforeAddFile,
    Divider=REDivider,
    defaultFiles = {},
    title=`Goblet Editor`,
    config={} as TEditorConfig,
  } = props

  const [curPath, setCurPath] = useState('')
  // TODO: figure out way to remove this
  // Gets set in the useRestoreModel via a change listener on model.onDidChangeContent
  // Is then passed down to the editor actions so they have access to it
  const curValueRef = useRef('')

  const {
    rootRef,
    filesRef,
    autoSave,
    editorRef,
    optionsRef,
    openedPathRef,
    editorNodeRef,
    onLoadFileRef,
    typesWorkerRef,
    onEditorBlurRef,
    editorStatesRef,
    onFileChangeRef,
    onPathChangeRef,
    onEditorFocusRef,
    onValueChangeRef,
    contentListenerRef,
  } = useEditorRefs({
    options,
    onLoadFile,
    defaultFiles,
    onPathChange,
    onFileChange,
    onValueChange
  })

  const { Modal } = useModalActions({ Modal: ModalComp })

  const {
    decoration,
    pathChange,
    openedFiles,
    restoreModel,
    setOpenedFiles,
  } = useEditorCallbacks({
    curPath,
    filesRef,
    editorRef,
    optionsRef,
    setCurPath,
    curValueRef,
    openedPaths,
    openedPathRef,
    onLoadFileRef,
    typesWorkerRef,
    editorNodeRef,
    onFileChangeRef,
    onPathChangeRef,
    editorStatesRef,
    onValueChangeRef,
    contentListenerRef,
  })

  const {
    styles,
    onMove,
    onMoveEnd,
    onMoveStart,
    resizeSidebar,
  } = useSidebarResize({
    onSidebarResize,
    initialStatus: sidebarStatus,
    initialWidth: sidebarWidth ?? config?.editor?.sidebar?.width,
  })

  const {
    keyDown,
    addFile,
    saveFile,
    closeFile,
    deleteFile,
    editFileName,
    abortFileChange,
  } = useEditorFileCallbacks({
    curPath,
    autoSave,
    filesRef,
    editorRef,
    onAddFile,
    onSaveFile,
    pathChange,
    setCurPath,
    deleteModel,
    openedFiles,
    onRenameFile,
    onDeleteFile,
    restoreModel,
    openedPathRef,
    setOpenedFiles,
  })

  useEditorSetup({
    ref,
    config,
    curPath,
    options,
    autoSave,
    filesRef,
    setTheme,
    saveFile,
    closeFile,
    editorRef,
    pathChange,
    decoration,
    openedFiles,
    resizeSidebar,
    onEditorLoaded,
    onEditorBlurRef,
    onEditorFocusRef,
  })

  const {
    addFolder,
    deleteFolder,
    editFolderName
  } = useFolderCallbacks({
    curPath,
    filesRef,
    autoSave,
    onAddFile,
    pathChange,
    deleteFile,
    deleteModel,
    onRenameFile,
    onDeleteFile,
    setOpenedFiles,
  })

  const { onAddEmptyFile, ...sideBar } = useEditorFileTree({
    addFile,
    rootPrefix,
    defaultFiles,
    onBeforeAddFile
  })

  const {
    openedTabs,
    onTabClose,
    onTabClick
  } = useTabs({
    Modal,
    autoSave,
    openedFiles,
    onSaveFile: saveFile,
    currentPath: curPath,
    onCloseFile: closeFile,
    rootEl: rootRef.current,
    onPathChange: pathChange,
    onAbortSave: abortFileChange,
  })

  return (
    <Container
      tabIndex={1}
      style={style}
      ref={rootRef}
      onKeyDown={keyDown}
      onMouseMove={onMove}
      onMouseUp={onMoveEnd}
      id='goblet-editor-root'
      className='goblet-editor'
    >
      <Sidebar
        {...sideBar}
        Modal={Modal}
        title={title}
        style={styles}
        portal={portal}
        Panels={Panels}
        filesRef={filesRef}
        PrePanels={PrePanels}
        currentPath={curPath}
        rootPrefix={rootPrefix}
        onAddFolder={addFolder}
        rootEl={rootRef.current}
        onPathChange={pathChange}
        onDeleteFile={deleteFile}
        defaultFiles={defaultFiles}
        onEditFileName={editFileName}
        onDeleteFolder={deleteFolder}
        onEditFolderName={editFolderName}
      />
      {!portal && (<Divider onMouseDown={onMoveStart} className='gb-editor-drag' />)}
      <EditorContainer className='goblet-editor-area'>
        <OpenedTabs
          openedTabs={openedTabs}
          onTabClose={onTabClose}
          onTabClick={onTabClick}
        />
        <Editor ref={editorNodeRef} sx={editorStyles} />
        {openedFiles.length === 0 && (
          <EmptyEditor
            Icon={FileIcon}
            text={emptyText}
            btnText='Create File'
            onClick={onAddEmptyFile}
            headerText='Low-Code Editor'
            subText='Create a new file, or select an existing file from the panel on the right.'
          />
        ) || null}
        {actions?.length && (
          <EditorActions
            curPath={curPath}
            open={actionsOpen}
            editorRef={editorRef}
            curValueRef={curValueRef}
            actions={actions as TEditorAction[]}
          />
        ) || null}
      </EditorContainer>
    </Container>
  )
})

export default MonacoEditor

MonacoEditor.displayName = 'MonacoEditor'

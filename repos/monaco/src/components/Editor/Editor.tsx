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

import { EditorContainer, Container, Divider as REDivider, Editor } from './Editor.styled'
import { useSidebarResize, FileIcon, Actions, EmptyEditor, OpenedTabs } from '@gobletqa/components'

const editorStyles = { flex: 1, width: '100%' }

export const MonacoEditor = forwardRef<IMultiRefType, IMonacoEditorProps>((props, ref) => {

  const {
    style,
    Panels,
    options,
    actions,
    PrePanels,
    emptyText,
    onLoadFile,
    onAddFile,
    onSaveFile,
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
    Divider=REDivider,
    defaultFiles = {},
    title='Goblet Editor',
    config={} as TEditorConfig,
  } = props

  const [curPath, setCurPath] = useState('')
  // TODO: figure out way to remove this
  // Gets set the the useRestoreModel via a change listener on model.onDidChangeContent
  // Is then passed down to the editor actions so they have access to it
  const curValueRef = useRef('')

  const {
    rootRef,
    filesRef,
    autoSave,
    editorRef,
    optionsRef,
    lintWorkerRef,
    openedPathRef,
    editorNodeRef,
    onLoadFileRef,
    typesWorkerRef,
    onEditorBlurRef,
    editorStatesRef,
    onFileChangeRef,
    onEditorFocusRef,
    onValueChangeRef,
    contentListenerRef,
  } = useEditorRefs({
    curPath,
    options,
    onLoadFile,
    defaultFiles,
    onPathChange,
    onFileChange,
    onValueChange
  })

  const { Modal } = useModalActions({ Modal: ModalComp })

  const {
    pathChange,
    openedFiles,
    restoreModel,
    setOpenedFiles,
  } = useEditorCallbacks({
    filesRef,
    editorRef,
    optionsRef,
    setCurPath,
    curValueRef,
    openedPathRef,
    lintWorkerRef,
    onLoadFileRef,
    typesWorkerRef,
    editorNodeRef,
    onFileChangeRef,
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
      {/* <Sidebar
        {...sideBar}
        Modal={Modal}
        title={title}
        style={styles}
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
      <Divider onMouseDown={onMoveStart} className='gr-editor-drag' /> */}
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
            headerText='Goblet Code Editor'
            subText='Create a new file, or select an existing file from the panel on the right.'
          />
        ) || null}
        {actions?.length && (
          <Actions
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

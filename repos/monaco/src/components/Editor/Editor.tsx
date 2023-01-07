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
import { useLintWorker } from '@GBM/hooks/editor/useLintWorker'
import { useEditorRefs } from '@GBM/hooks/editor/useEditorRefs'
import { useTypesWorker } from '@GBM/hooks/editor/useTypesWorker'
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

  const {
    rootRef,
    filesRef,
    autoSave,
    editorRef,
    optionsRef,
    openedPathRef,
    editorNodeRef,
    onLoadFileRef,
    onPathChangeRef,
    onEditorBlurRef,
    onEditorFocusRef,
    editorStatesRef,
    onFileChangeRef,
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

  const [lintWorkerRef] = useLintWorker({ editorRef })
  const [typesWorkerRef] = useTypesWorker({ editorRef })

  const [curPath, setCurPath] = useState('')
  const curPathRef = useRef('')
  const curValueRef = useRef('')

  const {
    Modal,
  } = useModalActions({
    Modal: ModalComp
  })

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
    closeOtherFiles,
  } = useEditorFileCallbacks({
    Modal,
    rootRef,
    autoSave,
    filesRef,
    editorRef,
    onAddFile,
    onSaveFile,
    curPathRef,
    pathChange,
    setCurPath,
    curValueRef,
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
    curPathRef,
    pathChange,
    openedFiles,
    curValueRef,
    resizeSidebar,
    onEditorLoaded,
    onPathChangeRef,
    onEditorBlurRef,
    onEditorFocusRef,
  })

  const {
    addFolder,
    deleteFolder,
    editFolderName
  } = useFolderCallbacks({
    filesRef,
    autoSave,
    onAddFile,
    curPathRef,
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
      <Sidebar
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
      <Divider onMouseDown={onMoveStart} className='gr-editor-drag' />
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
            open={actionsOpen}
            editorRef={editorRef}
            curPathRef={curPathRef}
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

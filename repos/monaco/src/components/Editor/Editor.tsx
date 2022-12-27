import type {
  IMultiRefType,
  TEditorConfig,
  IMonacoEditorProps,
} from '../../types'

import { useRef, useState, forwardRef } from 'react'

import { Empty } from '../Empty'
import { Sidebar } from '../Sidebar'
import { Actions } from '../Actions'
import { OpenedTabs } from '../OpenedTabs'
import { setTheme } from '../../init/setTheme'
import { useSidebarResize } from '../../goblet'
import { deleteModel } from '../../utils/editor/deleteModel'
import { useLintWorker } from '../../hooks/editor/useLintWorker'
import { useEditorRefs } from '../../hooks/editor/useEditorRefs'
import { useTypesWorker } from '../../hooks/editor/useTypesWorker'
import { useEditorSetup } from '../../hooks/editor/useEditorSetup'
import { useModalActions } from '../../hooks/editor/useModalActions'
import { useFolderCallbacks } from '../../hooks/editor/useFolderCallbacks'
import { useEditorCallbacks } from '../../hooks/editor/useEditorCallbacks'
import { useEditorFileCallbacks } from '../../hooks/editor/useEditorFileCallbacks'

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
    defaultPath,
    actionsOpen,
    onDeleteFile,
    onRenameFile,
    onPathChange,
    onFileChange,
    onValueChange,
    rootPrefix=``,
    Divider=`div`,
    sidebarWidth,
    sidebarStatus,
    onEditorLoaded,
    Modal:ModalComp,
    onSidebarResize,
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
    defaultPath,
    defaultFiles,
    onPathChange,
    onFileChange,
    onValueChange
  })

  const [lintWorkerRef] = useLintWorker({ editorRef })
  const [typesWorkerRef] = useTypesWorker({ editorRef })

  const [curPath, setCurPath] = useState(defaultPath || '')
  const curPathRef = useRef(defaultPath || '')
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
    defaultPath,
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


  return (
    <div
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
        Modal={Modal}
        title={title}
        style={styles}
        Panels={Panels}
        filesRef={filesRef}
        onAddFile={addFile}
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
      <Divider onMouseDown={onMoveStart} className='goblet-editor-drag' />
      <div className='goblet-editor-area'>
        <OpenedTabs
          Modal={Modal}
          autoSave={autoSave}
          onSaveFile={saveFile}
          currentPath={curPath}
          rootEl={rootRef.current}
          openedFiles={openedFiles}
          onCloseFile={closeFile}
          onPathChange={pathChange}
          onAbortSave={abortFileChange}
          onCloseOtherFiles={closeOtherFiles}
        />
        <div ref={editorNodeRef} style={editorStyles} />
        {openedFiles.length === 0 && (<Empty text={emptyText} />)}
        {actions?.length && (
          <Actions
            actions={actions}
            open={actionsOpen}
            editorRef={editorRef}
            curPathRef={curPathRef}
            curValueRef={curValueRef}
          />
        )}
      </div>
    </div>
  )
})

export default MonacoEditor

MonacoEditor.displayName = 'MonacoEditor'

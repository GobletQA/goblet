import type {
  IMultiRefType,
  TEditorConfig,
  IMonacoEditorProps,
} from '../../types'

import { useRef, useState, forwardRef } from 'react'

import { Empty } from '../Empty'
import { Sidebar } from '../Sidebar'
import { OpenedTabs } from '../OpenedTabs'
import { setTheme } from '../../init/setTheme'
import { deleteModel } from '../../utils/editor/deleteModel'
import { useLintWorker } from '../../hooks/editor/useLintWorker'
import { useEditorRefs } from '../../hooks/editor/useEditorRefs'
import { useTypesWorker } from '../../hooks/editor/useTypesWorker'
import { useEditorSetup } from '../../hooks/editor/useEditorSetup'
import { useModalActions } from '../../hooks/editor/useModalActions'
import { useSidebarResize } from '../../hooks/sidebar/useSidebarResize'
import { useFolderCallbacks } from '../../hooks/editor/useFolderCallbacks'
import { useEditorCallbacks } from '../../hooks/editor/useEditorCallbacks'
import { useEditorFileCallbacks } from '../../hooks/editor/useEditorFileCallbacks'

const editorStyles = { flex: 1, width: '100%' }

export const MonacoEditor = forwardRef<IMultiRefType, IMonacoEditorProps>((props, ref) => {
  
  const {
    emptyText,
    onLoadFile,
    onAddFile,
    onSaveFile,
    defaultPath,
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
    defaultFiles = {},
    title='Goblet Editor',
    config={} as TEditorConfig,
    options,
    Panels,
    PrePanels,
    Divider=`div`,
  } = props
  

  const {
    rootRef,
    prePath,
    filesRef,
    editorRef,
    optionsRef,
    editorNodeRef,
    onLoadFileRef,
    onPathChangeRef,
    editorStatesRef,
    onFileChangeRef,
    onValueChangeRef,
    contentListenerRef,
  } = useEditorRefs({
    options,
    defaultPath,
    defaultFiles,
    onLoadFile,
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
    prePath,
    filesRef,
    editorRef,
    optionsRef,
    setCurPath,
    curValueRef,
    defaultPath,
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
    initialWidth: sidebarWidth,
    initialStatus: sidebarStatus ?? config?.editor?.sidebar?.width ?? 200,
  })

  useEditorSetup({
    ref,
    config,
    curPath,
    options,
    filesRef,
    setTheme,
    editorRef,
    curPathRef,
    resizeSidebar,
    onEditorLoaded,
    onPathChangeRef,
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
    prePath,
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
    setOpenedFiles,
  })

  const {
    addFolder,
    deleteFolder,
    editFolderName
  } = useFolderCallbacks({
    filesRef,
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
      ref={rootRef}
      onKeyDown={keyDown}
      onMouseMove={onMove}
      onMouseUp={onMoveEnd}
      id='goblet-monaco-editor-root'
      className='goblet-monaco-editor'
    >
      <Sidebar
        Modal={Modal}
        title={title}
        style={styles}
        Panels={Panels}
        PrePanels={PrePanels}
        filesRef={filesRef}
        onAddFile={addFile}
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
      <Divider onMouseDown={onMoveStart} className='goblet-monaco-editor-drag' />
      <div className='goblet-monaco-editor-area'>
        <OpenedTabs
          Modal={Modal}
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
      </div>
    </div>
  )
})

export default MonacoEditor

MonacoEditor.displayName = 'MonacoEditor'

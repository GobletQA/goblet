import type { editor, IDisposable } from 'monaco-editor'
import type {
  IMultiRefType,
  TEditorConfig,
  IMonacoEditorProps,
} from '../../types'

import React, {
  useRef,
  useState,
} from 'react'

import { Empty } from '../Empty'
import { FileTree } from '../FileTree'
import { OpenedTabs } from '../OpenedTabs'
import { setTheme } from '../../init/setTheme'
import { createOrUpdateModel, deleteModel } from '../../utils'
import { useLintWorker } from '../../hooks/editor/useLintWorker'
import { useTypesWorker } from '../../hooks/editor/useTypesWorker'
import { useEditorSetup } from '../../hooks/editor/useEditorSetup'
import { useFileCallbacks } from '../../hooks/editor/useFileCallbacks'
import { useFileListResize } from '../../hooks/editor/useFileListResize'
import { useFolderCallbacks } from '../../hooks/editor/useFolderCallbacks'
import { useEditorCallbacks } from '../../hooks/editor/useEditorCallbacks'
import { useComponentOverride } from '../../hooks/editor/useComponentOverride'

export const MonacoEditor = React.forwardRef<IMultiRefType, IMonacoEditorProps>((props, ref) => {
  
  const {
    emptyText,
    onLoadFile,
    defaultPath,
    onPathChange,
    onValueChange,
    rootPrefix=``,
    Modal:ModalComp,
    defaultFiles = {},
    onFileChange,
    onFileTreeResize,
    initialFileTreeWidth,
    title='Goblet Editor',
    initialFileTreeStatus,
    config={} as TEditorConfig,
    options,
  } = props
  

  
  const onLoadFileRef = useRef(onLoadFile)
  const onPathChangeRef = useRef(onPathChange)
  const onValueChangeRef = useRef(onValueChange)
  const onFileChangeRef = useRef(onFileChange)
  const optionsRef = useRef(options)
  onPathChangeRef.current = onPathChange
  onValueChangeRef.current = onValueChange
  onFileChangeRef.current = onFileChange
  optionsRef.current = options

  const editorNodeRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const prePath = useRef<string | null>(defaultPath || '')
  
  const filesRef = useRef(defaultFiles)
  
  const contentListenerRef = useRef<IDisposable>()
  const editorStatesRef = useRef(new Map())
  const rootRef = useRef(null)

  const [lintWorkerRef] = useLintWorker({ editorRef })
  const [typesWorkerRef] = useTypesWorker({ editorRef })

  const [curPath, setCurPath] = useState(defaultPath || '')
  const curPathRef = useRef(defaultPath || '')
  const curValueRef = useRef('')

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
    contentListenerRef,
    onValueChangeRef,
  })

  const {
    styles,
    onMove,
    onMoveEnd,
    onMoveStart,
    resizeFileTree,
  } = useFileListResize({
    onFileTreeResize,
    initialStatus: initialFileTreeStatus,
    initialWidth: initialFileTreeWidth ?? config?.editor?.fileTree?.width ?? 200
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
    resizeFileTree,
    onPathChangeRef,
    createOrUpdateModel,
  })

  const {
    dealKey,
    addFile,
    saveFile,
    deleteFile,
    onCloseFile,
    editFileName,
    abortFileChange,
    closeOtherFiles,
  } = useFileCallbacks({
    rootRef,
    prePath,
    filesRef,
    editorRef,
    curPathRef,
    pathChange,
    setCurPath,
    curValueRef,
    deleteModel,
    openedFiles,
    restoreModel,
    setOpenedFiles,
    createOrUpdateModel,
  })

  const {
    addFolder,
    deleteFolder,
    editFolderName
  } = useFolderCallbacks({
    filesRef,
    curPathRef,
    pathChange,
    deleteFile,
    deleteModel,
    setOpenedFiles,
    createOrUpdateModel,
  })

  const {
    Modal,
  } = useComponentOverride({
    Modal: ModalComp
  })

  return (
    <div
      tabIndex={1}
      ref={rootRef}
      onKeyDown={dealKey}
      onMouseMove={onMove}
      onMouseUp={onMoveEnd}
      id='goblet-monaco-editor-root'
      className='goblet-monaco-editor'
    >
      <FileTree
        Modal={Modal}
        title={title}
        style={styles}
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
      <div onMouseDown={onMoveStart} className='goblet-monaco-editor-drag' />
      <div className='goblet-monaco-editor-area'>
        <OpenedTabs
          onSaveFile={saveFile}
          currentPath={curPath}
          rootEl={rootRef.current}
          openedFiles={openedFiles}
          onCloseFile={onCloseFile}
          onPathChange={pathChange}
          onAbortSave={abortFileChange}
          onCloseOtherFiles={closeOtherFiles}
        />
        <div ref={editorNodeRef} style={{ flex: 1, width: '100%' }} />
        {openedFiles.length === 0 && (<Empty text={emptyText} />)}
      </div>
    </div>
  )
})

export default MonacoEditor

MonacoEditor.displayName = 'MonacoEditor'

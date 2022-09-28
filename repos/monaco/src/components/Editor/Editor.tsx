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


export const MonacoEditor = React.forwardRef<IMultiRefType, IMonacoEditorProps>(
  (
    {
      emptyText,
      defaultPath,
      onPathChange,
      onValueChange,
      defaultFiles = {},
      onFileChange,
      onFileTreeResize,
      initialFileTreeWidth,
      initialFileTreeStatus,
      config={} as TEditorConfig,
      options,
    },
    ref
  ) => {

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
    const valueListenerRef = useRef<IDisposable>()
    const editorStatesRef = useRef(new Map())
    const rootRef = useRef(null)

    const [lintWorkerRef] = useLintWorker({ editorRef })
    const [typesWorkerRef] = useTypesWorker({ editorRef })

    const [curPath, setCurPath] = useState(defaultPath || '')
    const curPathRef = useRef(defaultPath || '')
    const curValueRef = useRef('')

    const {
      openedFiles,
      setOpenedFiles,
      restoreModel,
      handlePathChange
    } = useEditorCallbacks({
      prePath,
      editorRef,
      optionsRef,
      setCurPath,
      curValueRef,
      defaultPath,
      lintWorkerRef,
      typesWorkerRef,
      editorNodeRef,
      onFileChangeRef,
      editorStatesRef,
      valueListenerRef,
      onValueChangeRef,
    })

    const {
      styles,
      handleMove,
      handleMoveEnd,
      handleMoveStart,
      resizeFileTree,
    } = useFileListResize({
      onFileTreeResize,
      initialStatus: initialFileTreeStatus,
      initialWidth: initialFileTreeWidth ?? config?.editor?.fileTree?.width ?? 180
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
      setCurPath,
      curValueRef,
      deleteModel,
      openedFiles,
      restoreModel,
      setOpenedFiles,
      handlePathChange,
      createOrUpdateModel
    })

    const {
      addFolder,
      deleteFolder,
      editFolderName
    } = useFolderCallbacks({
      filesRef,
      curPathRef,
      deleteFile,
      deleteModel,
      setOpenedFiles,
      handlePathChange,
      createOrUpdateModel
    })

    return (
      <div
        ref={rootRef}
        id='goblet-monaco-editor-root'
        tabIndex={1}
        onKeyDown={dealKey}
        onMouseMove={handleMove}
        onMouseUp={handleMoveEnd}
        className='goblet-monaco-editor'
      >
        <FileTree
          rootEl={rootRef.current}
          onEditFileName={editFileName}
          onDeleteFile={deleteFile}
          onAddFile={addFile}
          onAddFolder={addFolder}
          onDeleteFolder={deleteFolder}
          onEditFolderName={editFolderName}
          style={styles}
          title='Goblet Editor'
          currentPath={curPath}
          defaultFiles={defaultFiles}
          onPathChange={handlePathChange}
        />
        <div onMouseDown={handleMoveStart} className='goblet-monaco-editor-drag' />
        <div className='goblet-monaco-editor-area'>
          <OpenedTabs
            onCloseOtherFiles={closeOtherFiles}
            onSaveFile={saveFile}
            onAbortSave={abortFileChange}
            rootEl={rootRef.current}
            currentPath={curPath}
            openedFiles={openedFiles}
            onCloseFile={onCloseFile}
            onPathChange={handlePathChange}
          />
          <div ref={editorNodeRef} style={{ flex: 1, width: '100%' }} />
          {openedFiles.length === 0 && (<Empty text={emptyText} />)}
        </div>
      </div>
    )
  }
)

export default MonacoEditor

MonacoEditor.displayName = 'MonacoEditor'

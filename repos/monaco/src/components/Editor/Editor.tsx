import type {
  IMultiRefType,
  TEditorConfig,
  IMonacoEditorProps,
} from '../../types'

import React, {
  useRef,
  useState,
} from 'react'

import FileList from '../filelist'
import OpenedTab from '../openedtab'
import * as TMonacoType from 'monaco-editor'
import { setTheme } from '../../init/setTheme'
import { createOrUpdateModel, deleteModel } from '../../utils'
import { useLintWorker } from '../../hooks/editor/useLintWorker'
import { useEditorSetup } from '../../hooks/editor/useEditorSetup'
import { useFileCallbacks } from '../../hooks/editor/useFileCallbacks'
import { useFileListResize } from '../../hooks/editor/useFileListResize'
import { useFolderCallbacks } from '../../hooks/editor/useFolderCallbacks'
import { useEditorCallbacks } from '../../hooks/editor/useEditorCallbacks'


export const MultiEditorComp = React.forwardRef<IMultiRefType, IMonacoEditorProps>(
  (
    {
      defaultPath,
      onPathChange,
      onValueChange,
      defaultFiles = {},
      onFileChange,
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
    const editorRef = useRef<TMonacoType.editor.IStandaloneCodeEditor | null>(null)
    const prePath = useRef<string | null>(defaultPath || '')
    const filesRef = useRef(defaultFiles)
    const valueListenerRef = useRef<TMonacoType.IDisposable>()
    const editorStatesRef = useRef(new Map())
    const rootRef = useRef(null)

    const [lintWorkerRef] = useLintWorker({ editorRef })

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
      editorNodeRef,
      onFileChangeRef,
      editorStatesRef,
      valueListenerRef,
      onValueChangeRef,
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

    const {
      styles,
      handleMove,
      handleMoveEnd,
      handleMoveStart,
    } = useFileListResize({
      initialWidth: config?.editor?.fileList?.width || 180
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
        <FileList
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
          <OpenedTab
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
          {openedFiles.length === 0 && (
            <div className='goblet-monaco-editor-area-empty'>
              <div>Goblet Editor</div>
            </div>
          )}
        </div>
      </div>
    )
  }
)

export default MultiEditorComp

MultiEditorComp.displayName = 'MultiEditorComp'

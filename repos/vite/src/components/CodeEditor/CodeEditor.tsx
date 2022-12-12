import type { TEditorRefHandle } from '@gobletqa/monaco'

import { useRef } from 'react'
import { BlockIcon } from '@components/Icons'
import { ConnectPanel } from './ConnectPanel'
import { EditorSidebarWidth } from '@constants'
import { MonacoEditor } from '@gobletqa/monaco'
import { DrawAction } from './Actions/DrawAction'
import { Divider } from '@components/Layout/Divider'
import { RepoNotConnected } from './RepoNotConnected'
import { SquareAction } from './Actions/SquareAction'
import { PictureAction } from './Actions/PictureAction'
import { RunTestsAction } from './Actions/RunTestsAction'
import { useMonacoHooks } from '@hooks/monaco/useMonacoHooks'
import { RecordBrowserAction } from './Actions/RecordBrowserAction'

const Actions = [
  RunTestsAction,
  RecordBrowserAction,
  DrawAction,
  SquareAction,
  PictureAction
]

const PrePanels = [
  ConnectPanel
]

export type TCodeEditorProps = {
  style?: Record<string, string|number>
}
export const CodeEditor = (props:TCodeEditorProps) => {

  const editorRef = useRef<TEditorRefHandle>(null)

  const {
    files,
    config,
    options,
    onAddFile,
    onSaveFile,
    onRenameFile,
    onDeleteFile,
    connected,
    rootPrefix,
    onLoadFile,
    modalActions,
    onMonacoLoaded,
    onEditorLoaded,
  } = useMonacoHooks(editorRef)

  return connected
    ? (
        <MonacoEditor
          {...props}
          ref={editorRef}
          config={config}
          actions={Actions}
          Divider={Divider}
          options={options}
          actionsOpen={false}
          sidebarStatus={true}
          Modal={modalActions}
          defaultFiles={files}
          PrePanels={PrePanels}
          onAddFile={onAddFile}
          onSaveFile={onSaveFile}
          rootPrefix={rootPrefix}
          onLoadFile={onLoadFile}
          onRenameFile={onRenameFile}
          onDeleteFile={onDeleteFile}
          onMonacoLoaded={onMonacoLoaded}
          onEditorLoaded={onEditorLoaded}
          sidebarWidth={EditorSidebarWidth}
        />
      )
    : (
        <RepoNotConnected
          Icon={BlockIcon}
          message='Repository not connected'
        />
      )
  
}
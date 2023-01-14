import type { TEditorRefHandle } from '@gobletqa/monaco'

import { useRef } from 'react'
import { EditorSidebarWidth } from '@constants'
import { MonacoEditor } from '@gobletqa/monaco'
import { BlockIcon } from '@gobletqa/components'
import { Actions } from '../EditorActions/Actions'
import { Divider } from '@components/Layout/Divider'
import { NotConnected } from '@components/NotConnected'
import { PrePanels } from '@components/Panels/PrePanels'
import { useMonacoHooks } from '@hooks/monaco/useMonacoHooks'

export type TCodeEditorProps = {
  portal?:string
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
        <NotConnected
          Icon={BlockIcon}
          message='Repository not connected'
        />
      )
  
}
import type { TEditorRefHandle } from '@gobletqa/monaco'

import { useRef } from 'react'
import { MonacoEditor } from '@gobletqa/monaco'
import { Actions } from '../EditorActions/Actions'
import { Divider } from '@components/Layout/Divider'
import { NotConnected } from '@components/NotConnected'
import { PrePanels } from '@components/Panels/PrePanels'
import { useMonacoHooks } from '@hooks/monaco/useMonacoHooks'
import { BlockIcon, DefSidebarWidth } from '@gobletqa/components'

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
    onPathChange,
    onBeforeAddFile,
    connected,
    rootPrefix,
    onLoadFile,
    modalActions,
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
          onPathChange={onPathChange}
          onRenameFile={onRenameFile}
          onDeleteFile={onDeleteFile}
          sidebarWidth={DefSidebarWidth}
          onBeforeAddFile={onBeforeAddFile}
        />
      )
    : (
        <NotConnected
          Icon={BlockIcon}
          message='Repository not connected'
        />
      )
  
}
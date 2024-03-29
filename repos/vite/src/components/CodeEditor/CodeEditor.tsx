import type { CSSProperties } from 'react'
import type { TEditorAction, TEditorRefHandle } from '@gobletqa/monaco'

import { useRef } from 'react'
import { useApp } from '@store'
import { MonacoEditor } from '@gobletqa/monaco'
import { Divider } from '@components/Divider/Divider'
import { NotConnected } from '@components/NotConnected'
import { PrePanels } from '@components/Panels/PrePanels'
import { MonacoActions } from '../EditorActions/Actions'
import { useMonacoHooks } from '@hooks/monaco/useMonacoHooks'
import { BlockIcon, SidebarOpenWidth } from '@gobletqa/components'

export type TCodeEditorProps = {
  portal?:string
  style?: CSSProperties
}
export const CodeEditor = (props:TCodeEditorProps) => {
  const { sidebarLocked } = useApp()
  const editorRef = useRef<TEditorRefHandle>(null)

  const {
    files,
    config,
    options,
    onAddFile,
    onSaveFile,
    lastOpened,
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
          Divider={Divider}
          options={options}
          actionsOpen={false}
          Modal={modalActions}
          defaultFiles={files}
          PrePanels={PrePanels}
          onAddFile={onAddFile}
          onSaveFile={onSaveFile}
          rootPrefix={rootPrefix}
          onLoadFile={onLoadFile}
          openedPaths={lastOpened}
          onPathChange={onPathChange}
          onRenameFile={onRenameFile}
          onDeleteFile={onDeleteFile}
          sidebarStatus={sidebarLocked}
          sidebarWidth={SidebarOpenWidth}
          onBeforeAddFile={onBeforeAddFile}
          actions={MonacoActions as TEditorAction[]}
        />
      )
    : (
        <NotConnected
          Icon={BlockIcon}
          message='Repository not connected'
        />
      )
  
}
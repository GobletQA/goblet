import { useRef } from 'react'
import { BlockIcon } from '@components/Icons'
import { EditorSidebarWidth } from '@constants'
import { MonacoEditor } from '@gobletqa/monaco'
import { Divider } from '@components/Layout/Divider'
import { RepoNotConnected } from './RepoNotConnected'
import { useMonacoHooks } from '@hooks/monaco/useMonacoHooks'
import { ArtifactsPanel } from '@components/Artifacts/ArtifactsPanel'
import { EnvironmentsPanel } from '@components/Environments/EnvironmentsPanel'


const Panels = [
  ArtifactsPanel,
  EnvironmentsPanel
]

export type TCodeEditorProps = {}
export const CodeEditor = (props:TCodeEditorProps) => {

  const editorRef = useRef<any>(null)

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
          ref={editorRef}
          Panels={Panels}
          config={config}
          Divider={Divider}
          options={options}
          sidebarStatus={true}
          Modal={modalActions}
          defaultFiles={files}
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
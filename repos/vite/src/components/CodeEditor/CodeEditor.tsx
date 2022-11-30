import { useRef } from 'react'
import { FileTreeWidth } from '@constants'
import { BlockIcon } from '@components/Icons'
import { MonacoEditor } from '@gobletqa/monaco'
import { RepoNotConnected } from './RepoNotConnected'
import { useMonacoHooks } from '@hooks/monaco/useMonacoHooks'

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
  } = useMonacoHooks(editorRef)

  return connected
    ? (
        <MonacoEditor
          ref={editorRef}
          config={config}
          options={options}
          Modal={modalActions}
          defaultFiles={files}
          onAddFile={onAddFile}
          onSaveFile={onSaveFile}
          rootPrefix={rootPrefix}
          onLoadFile={onLoadFile}
          onRenameFile={onRenameFile}
          onDeleteFile={onDeleteFile}
          initialFileTreeStatus={true}
          initialFileTreeWidth={FileTreeWidth}
        />
      )
    : (
        <RepoNotConnected
          Icon={BlockIcon}
          message='Repository not connected'
        />
      )
  
}
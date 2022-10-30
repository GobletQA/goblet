import { useRef } from 'react'
import { FileTreeWidth } from '@constants'
import { BlockIcon } from '@components/Icons'
import { useEditorHooks } from './editorHooks'
import { MonacoEditor } from '@gobletqa/monaco'
import { RepoNotConnected } from './RepoNotConnected'

export type TCodeEditorProps = {}

export const CodeEditor = (props:TCodeEditorProps) => {

  const editorRef = useRef<any>(null)

  const {
    files,
    connected,
    rootPrefix,
    onLoadFile,
    onFileChange,
    onPathChange,
    modalActions,
    onValueChange,
  } = useEditorHooks(props, editorRef)

  // TODO: add callbacks for these methods to handled calling server
  // And updating the redux store
  // onDeleteFile
  // onAddFile
  // onSaveFile

  return connected
    ? (
        <MonacoEditor
          ref={editorRef}
          Modal={modalActions}
          defaultFiles={files}
          onLoadFile={onLoadFile}
          rootPrefix={rootPrefix}
          initialFileTreeStatus={true}
          initialFileTreeWidth={FileTreeWidth}
          onPathChange={onPathChange}
          onValueChange={onValueChange}
          onFileChange={onFileChange}
          options={{
            fontSize: 14,
            automaticLayout: true,
          }}
        />
      )
    : (
        <RepoNotConnected
          Icon={BlockIcon}
          message='Repository not connected'
        />
      )
  
}
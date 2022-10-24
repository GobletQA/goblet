import type { ComponentProps, ComponentType } from 'react'

import { useRef } from 'react'
import Box from '@mui/material/Box'
import { Text } from '@components/Text'
import { BlockIcon } from '@components/Icons'
import { gutter, monaco, colors } from '@theme'
import { FileTreeWidth } from '@constants'
import { Loading } from '@components/Loading'
import { MonacoEditor } from '@gobletqa/monaco'
import { ConfirmModal } from '@components/Modals/ConfirmModal'
import { useEditorHooks } from './editorHooks'

const Modal = ConfirmModal as ComponentType<any>

export type TCodeEditorProps = {
  
}

export type TEditorLoading = ComponentProps<typeof Loading> 

export type TEditorError = {
  message: string
  Icon: ComponentType<any>
}

const EditorLoading = (props:TEditorLoading) => {
  const {
    messageSx,
    hideSpinner,
    message=`Editor Loading`
  } = props
  
  return (
    <Box
      className='editor-loading'
      height='100%'
      display='flex'
      alignItems='center'
      justifyContent='center'
      bgcolor={monaco.editorBackground}
    >
      <Loading
        message={message}
        hideSpinner={hideSpinner}
        messageSx={messageSx ?? { color: colors.white }}
      />
    </Box>
  )
}

const RepoNotConnected = (props:TEditorError) => {
  const {
    Icon,
    message,
  } = props
  
  
  return (
    <Box
      className='editor-error'
      height='100%'
      display='flex'
      alignItems='center'
      flexDirection='column'
      justifyContent='center'
      bgcolor={monaco.editorBackground}
    >
      <Icon
        sx={{
          fontSize: `40px`,
          color: colors.error,
        }}
      />
      <Text
        type='h6'
        sx={{
          fontSize: `20px`,
          color: colors.white,
          marginTop: gutter.margin.hpx
        }}
      >
        {message}
      </Text>
    </Box>
  )
}


export const CodeEditor = (props:TCodeEditorProps) => {

  const editorRef = useRef<any>(null)

  const {
    connected,
    editorFiles,
    onFileChange,
    onPathChange,
    onValueChange,
  } = useEditorHooks(props, editorRef)

  return connected
    ? (
        <MonacoEditor
          Modal={Modal}
          ref={editorRef}
          defaultFiles={editorFiles}
          initialFileTreeStatus={true}
          initialFileTreeWidth={FileTreeWidth}
          onPathChange={onPathChange}
          onValueChange={onValueChange}
          onFileChange={onFileChange}
          options={{
            fontSize: 16,
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
import type { ComponentProps, ComponentType } from 'react'
import { useRef } from 'react'

import Box from '@mui/material/Box'
import { monaco, colors } from '@theme'
import { Loading } from '@components/Loading'


export type TEditorLoading = ComponentProps<typeof Loading> 

export const EditorLoading = (props:TEditorLoading) => {
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
        messageSx={messageSx ?? { color: colors.white00 }}
      />
    </Box>
  )
}

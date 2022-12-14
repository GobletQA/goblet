import type { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { monaco, colors } from '@theme'
import { Loading } from '@components/Loading'
import { useColor } from '@hooks/theme/useColor'

export type TEditorLoading = ComponentProps<typeof Loading> 

export const EditorLoading = (props:TEditorLoading) => {
  const {
    messageSx,
    hideSpinner,
    message=`Editor Loading`
  } = props

  const color = useColor(colors.white00, colors.black03)

  return (
    <Box
      height='100%'
      display='flex'
      alignItems='center'
      justifyContent='center'
      className='editor-loading'
      bgcolor={monaco.editorBackground}
    >
      <Loading
        message={message}
        hideSpinner={hideSpinner}
        messageSx={messageSx || { color }}
      />
    </Box>
  )
}

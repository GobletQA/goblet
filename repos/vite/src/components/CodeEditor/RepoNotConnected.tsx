import type { ComponentType } from 'react'

import Box from '@mui/material/Box'
import { Text } from '@components/Text'
import { gutter, monaco, colors } from '@theme'

export type TNotConnected = {
  message: string
  Icon: ComponentType<any>
}

export const RepoNotConnected = (props:TNotConnected) => {
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

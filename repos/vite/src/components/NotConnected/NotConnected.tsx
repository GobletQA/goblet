import type { ComponentType } from 'react'
import type { TUColors } from '@hooks/theme'

import Box from '@mui/material/Box'
import { useColors } from '@hooks/theme'
import { Text } from '@gobletqa/components'
import { gutter, colors } from '@gobletqa/components/theme'

export type TNotConnected = {
  message: string
  Icon: ComponentType<any>
}

const colorMap:TUColors = {
  icon: [colors.error, colors.error],
  text: [colors.black09, colors.white],
  container: [colors.white,  colors.black12],
}

export const NotConnected = (props:TNotConnected) => {
  const {
    Icon,
    message,
  } = props

  const mapped = useColors(colorMap)

  return (
    <Box
      className='editor-error'
      height='100%'
      display='flex'
      alignItems='center'
      flexDirection='column'
      justifyContent='center'
      bgcolor={mapped.container}
    >
      <Icon
        sx={{
          fontSize: `40px`,
          color: mapped.icon,
        }}
      />
      <Text
        component='h6'
        sx={{
          fontSize: `20px`,
          color: mapped.text,
          marginTop: gutter.margin.hpx
        }}
      >
        {message}
      </Text>
    </Box>
  )
}

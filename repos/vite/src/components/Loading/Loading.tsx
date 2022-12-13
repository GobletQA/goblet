import type { ReactNode, ComponentProps } from 'react'
import type { CSSObj } from '@types'
import { gutter } from '@theme'
import Box from '@mui/material/Box'
import { Text } from '@components/Text'
import CircularProgress from '@mui/material/CircularProgress'

export type TLoading = ComponentProps<typeof CircularProgress> & {
  message?:ReactNode
  messageSx?: CSSObj
  containerSx?:CSSObj
  hideSpinner?:boolean
  pos?: `before` | `after`
}

export const Loading = (props:TLoading) => {
  const {
    message,
    messageSx,
    hideSpinner,
    containerSx,
    pos=`after`,
    ...progProps
  } = props
  
  const styleArr = [
    {
      width: '100%',
      fontSize: `18px`,
      marginTop: gutter.margin.px,
    },
    messageSx as CSSObj
  ]

  return (
    <Box 
      width='100%'
      textAlign='center'
      className="loading-container"
      sx={containerSx}
    >
      {message && pos !== `after` && (
        <Text type="h6" sx={styleArr} >
          {message}
        </Text>
      )}
      {!hideSpinner && (<CircularProgress {...progProps} />)}
      {message && pos === `after` && (
        <Text type="h6" sx={styleArr} >
          {message}
        </Text>
      )}
    </Box>
  )
}


import type { ComponentProps } from 'react'
import type { CSSObj } from '@types'
import { gutter } from '@theme'
import Box from '@mui/material/Box'
import { Text } from '@components/Text'
import CircularProgress from '@mui/material/CircularProgress'

export type TLoading = ComponentProps<typeof CircularProgress> & {
  message?:string
  messageSx?: CSSObj
  hideSpinner?:boolean
  pos?: `before` | `after`
}

export const Loading = (props:TLoading) => {
  const {
    message,
    messageSx,
    hideSpinner,
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
      className="loading-container"
      width='100%'
      textAlign='center'
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


import type { ReactNode, ComponentProps } from 'react'
import type { CSSObj } from '@types'

import Box from '@mui/material/Box'
import { Text } from '@gobletqa/components'
import { ensureArr } from '@keg-hub/jsutils'
import { gutter } from '@gobletqa/components/theme'
import CircularProgress from '@mui/material/CircularProgress'

export type TLoading = ComponentProps<typeof CircularProgress> & {
  message?:ReactNode
  hideSpinner?:boolean
  messageSx?: CSSObj|CSSObj[]
  containerSx?:CSSObj|CSSObj[]
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
    ...ensureArr<CSSObj>(messageSx)
  ]

  return (
    <Box 
      width='100%'
      textAlign='center'
      className="loading-container"
      sx={containerSx}
    >
      {message && pos !== `after` && (
        <Text variant="h6" sx={styleArr} >
          {message}
        </Text>
      )}
      {!hideSpinner && (<CircularProgress {...progProps} />)}
      {message && pos === `after` && (
        <Text variant="h6" sx={styleArr} >
          {message}
        </Text>
      )}
    </Box>
  )
}


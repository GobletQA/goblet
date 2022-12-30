import type { CSSProperties, ReactNode, ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { gutter } from '@GBC/theme'
import { Text } from '@GBC/components/Text'
import { ensureArr } from '@keg-hub/jsutils'
import CircularProgress from '@mui/material/CircularProgress'

export type TLoading = ComponentProps<typeof CircularProgress> & {
  message?:ReactNode
  hideSpinner?:boolean
  messageSx?: CSSProperties|CSSProperties[]
  containerSx?:CSSProperties|CSSProperties[]
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
    ...ensureArr<CSSProperties>(messageSx)
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


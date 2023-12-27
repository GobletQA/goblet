import type { CSSProperties, ReactNode, ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { gutter } from '@GBC/theme'
import { cls } from '@keg-hub/jsutils/cls'
import { Text } from '@GBC/components/Text'
import { ensureArr } from '@keg-hub/jsutils/ensureArr'
import CircularProgress from '@mui/material/CircularProgress'

export type TLoading = ComponentProps<typeof CircularProgress> & {
  className?:string
  message?:ReactNode
  hideSpinner?:boolean
  sx?: CSSProperties | CSSProperties[]
  messageSx?: CSSProperties | CSSProperties[]
  containerSx?: CSSProperties | CSSProperties[]
  pos?: `before` | `after`
}

export const Loading = (props:TLoading) => {
  const {
    sx,
    message,
    messageSx,
    className,
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
      sx={sx ?? containerSx as CSSProperties}
      className={cls(`loading-container`, className)}
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


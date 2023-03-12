import type { CSSProperties } from 'react'
import type { TChangeCB, TInputVariants } from '@gobletqa/components'
import { ESectionType } from '@GBR/types'
import { Title } from './Title'

import { cls } from '@keg-hub/jsutils'
import Box from '@mui/material/Box'

const styles = {
  content: {
    width: `100%`,
    height: `100%`,
    display: `flex`,
    flexDirection: `column`,
  },
}

export type TEditTitle = {
  id?:string
  uuid?:string
  name?:string
  value?:string
  label?:string
  margin?:string
  padding?:string
  onBlur?:TChangeCB
  sx?:CSSProperties
  className?:string
  type:ESectionType
  helperText?:string
  autoFocus?:boolean
  onChange?:TChangeCB
  variant?:TInputVariants
}

export const EditTitle = (props:TEditTitle) => {
  
  const {
    sx,
    margin,
    padding,
    className,
    autoFocus=true,
    ...rest
  } = props
  
  return (
    <Box
      margin={margin}
      padding={padding}
      sx={[styles.content, sx] as CSSProperties[]}
      className={cls(`gb-${props.type}}-editing-title`, className)}
    >
      <Title autoFocus={autoFocus} {...rest} />
    </Box>
  )
}
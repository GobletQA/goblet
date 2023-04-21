import type { CSSProperties } from 'react'
import type { TChangeCB, TInputVariants } from '@gobletqa/components'

import { Title } from './Title'
import Box from '@mui/material/Box'
import { cls } from '@keg-hub/jsutils'
import { ESectionType } from '@GBR/types'
import { gutter } from '@gobletqa/components'

const styles = {
  content: {
    width: `100%`,
    height: `100%`,
    display: `flex`,
    marginTop: `0px`,
    flexDirection: `column`,
    marginBottom: gutter.margin.px,
    padding: `0px ${gutter.padding.hpx}`,
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
  inputSx?:CSSProperties
  titleSX?:CSSProperties
  variant?:TInputVariants
}

export const EditTitle = (props:TEditTitle) => {
  
  const {
    sx,
    margin,
    titleSX,
    inputSx,
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
      className={cls(`gb-${props.type}-editing-title`, className)}
    >
      <Title
        sx={inputSx}
        autoFocus={autoFocus}
        containerSx={titleSX}
        {...rest}
      />
    </Box>
  )
}
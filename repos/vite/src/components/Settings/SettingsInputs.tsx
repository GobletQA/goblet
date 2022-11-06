import type { CSSObj } from '@types'
import type { ComponentProps, ChangeEventHandler, ChangeEvent, FocusEvent, FocusEventHandler } from 'react'

import { useCallback, useState, useRef } from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import MuiSwitch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { StyledInput } from './Settings.styled'

export type TSwitch = ComponentProps<typeof MuiSwitch> & {
  
}

export const Switch = (props:TSwitch) => {
  const { ...rest } = props
  return (<MuiSwitch {...rest} />)
}

export type TInput = ComponentProps<typeof TextField> & {
  prefix?:string
  postfix?:string
  align: `left`|`right`
}

export const Input = (props:TInput) => {
  const {
    sx,
    align,
    value,
    prefix,
    postfix,
    className,
    inputProps=noOpObj,
    ...rest
  } = props

  const [val, setVal] = useState(value)
  const inputRef = useRef<HTMLInputElement>()

  const onChange = useCallback((evt:ChangeEvent<HTMLInputElement>|FocusEvent<HTMLInputElement>) => {
    setVal(evt.target.value)

    evt.type === `change`
      ? props.onChange?.(evt, val)
      : props.onBlur?.(evt, val)
  }, [val, props.onChange, props.onBlur])

  const onKeyDown = useCallback((evt:any) => {
    // Check if the enter key was pressed
    if(evt.keyCode !== 13) return

    evt.preventDefault()
    inputRef?.current?.blur()

  }, [value, props.onBlur])

  return (
    <>
      {prefix ? (<Typography sx={{ paddingRight: `2px` }} >{prefix}</Typography>) : null}
      <StyledInput
        {...rest}
        className={`setting-input ${className || ''}`.trim()}
        sx={[{
          minWidth: `30px`,
          width: `${(('' + val).length * 10)}px`
        }, sx]}
        inputProps={{
          ...inputProps,
          sx: [{
            padding: `4px`,
            textAlign: align,
          }, inputProps?.sx]
        }}
        value={val}
        inputRef={inputRef}
        onKeyDown={onKeyDown}
        onBlur={onChange as FocusEventHandler<HTMLInputElement>}
        onChange={onChange as ChangeEventHandler<HTMLInputElement>}
      />
      {postfix ? (<Typography sx={{ paddingLeft: `2px` }} >{postfix}</Typography>) : null}
    </>
  )
}

export type TText = ComponentProps<typeof Typography> & {
  sx?:CSSObj
  value: any
  align: `left`|`right`
}

export const Text = (props:TText) => {
  const {
    sx,
    align,
    value,
    ...rest
  } = props

  return (
    <Typography
      {...rest}
      sx={[{
        width: `100%`,
        textAlign: align
      }, sx]}
    >
      {`${value}`}
    </Typography>
  )
}
import type { CSSObj } from '@types'
import type { ComponentProps, ChangeEventHandler, ChangeEvent, FocusEvent, FocusEventHandler } from 'react'

import { useCallback, useState, useRef } from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import MuiSwitch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { StyledInput } from './Settings.styled'
import Typography from '@mui/material/Typography'
import { useColorMap } from '@hooks/theme/useColorMap'

export type TSwitch = ComponentProps<typeof MuiSwitch> & {}

export const Switch = (props:TSwitch) => {
  const { ...rest } = props
  return (<MuiSwitch {...rest} />)
}

export type TInput = ComponentProps<typeof TextField> & {
  prefix?:string
  postfix?:string
  align: `left`|`right`
  onBlur?: (...args:any[]) => void
  onChange?: (...args:any[]) => void
}

export const Input = (props:TInput) => {
  const {
    sx,
    align,
    value,
    prefix,
    postfix,
    disabled,
    className,
    inputProps=noOpObj as Record<string, any>,
    ...rest
  } = props

  const colors = useColorMap()
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
      {prefix
        ? (
            <Typography
              sx={[
                { paddingRight: `2px` },
                disabled && { color: colors.disabled } as any
              ]}
            >
              {prefix}
            </Typography>
          )
        : null
      }
      <StyledInput
        {...rest}
        disabled={disabled}
        className={`setting-input ${className || ''}`.trim()}
        sx={[{
          minWidth: `30px`,
          width: `${(('' + val).length * 12)}px`
        }, sx as CSSObj]}
        inputProps={{
          ...inputProps,
          sx: [{
            padding: `4px`,
            textAlign: align,
          }, inputProps?.sx as CSSObj]
        }}
        value={val}
        inputRef={inputRef}
        onKeyDown={onKeyDown}
        onBlur={onChange as FocusEventHandler<HTMLInputElement>}
        onChange={onChange as ChangeEventHandler<HTMLInputElement>}
      />
      {postfix
        ? (
            <Typography
              sx={[
                { paddingLeft: `2px` },
                disabled && { color: colors.disabled } as any
              ]}
            >
              {postfix}
            </Typography>
          )
        : null
      }
    </>
  )
}

export type TText = ComponentProps<typeof Typography> & {
  sx?:CSSObj
  value: any
  disabled:boolean
  align: `left`|`right`
}

export const Text = (props:TText) => {
  const {
    sx,
    align,
    value,
    disabled,
    ...rest
  } = props

  const colors = useColorMap()

  return (
    <Typography
      {...rest}
      sx={[
        {
          width: `100%`,
          textAlign: align
        },
        sx as CSSObj,
        disabled && { color: colors.disabled } as CSSObj,
      ]}
    >
      {`${value}`}
    </Typography>
  )
}
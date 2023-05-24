import type { TSetting, CSSObj } from '@types'
import type {
  FocusEvent,
  ChangeEvent,
  KeyboardEvent,
  ComponentProps,
  FocusEventHandler,
  ChangeEventHandler,
} from 'react'


import { noOpObj } from '@keg-hub/jsutils'
import MuiSwitch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { StyledInput } from './Settings.styled'
import Typography from '@mui/material/Typography'
import { useColorMap } from '@hooks/theme/useColorMap'
import { useCallback, useState, useRef, forwardRef } from 'react'


import MuiInput from '@mui/material/Input'
import MuiSelect from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'

type TSelectEvent = {
  target: Record<`value`, any>
}

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

  const onKeyDown = useCallback((evt:KeyboardEvent<HTMLInputElement>) => {
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

export const Text = forwardRef((props:TText, ref:any) => {
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
      ref={ref}
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
})

export type TSelect = Omit<ComponentProps<typeof MuiSelect>, `onChange`> & {
  item:TSetting
  onChange:(data:Record<'value', any>) => void
}

export const Select = (props:TSelect) => {
  const {
    item,
    value,
    onChange,
    ...rest
  } = props

  const onValueChange = useCallback((evt:TSelectEvent) => {
    value !== evt?.target?.value && onChange?.(evt?.target)
  }, [value, onChange])

  return (
    <div>
      <FormControl sx={{ m: 0, padding: `0px`, width: 125 }}>
        <MuiSelect
          input={<MuiInput />}
          {...rest}
          value={value || item.emptyOption}
          onChange={onValueChange}
        >
          {
            item.emptyOption
              && !item?.options?.includes(item.emptyOption as string)
              && (
                <MenuItem
                  key={item.emptyOption}
                  value={item.emptyOption}
                >
                  {item.emptyOption}
                </MenuItem>
              )
          }
          {item?.options?.map((option:string) => (
            <MenuItem
              key={option}
              value={option}
            >
              {option}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    </div>
  )
  
}
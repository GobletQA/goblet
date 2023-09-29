import type { FormHelperTextProps } from '@mui/material/FormHelperText'
import type {
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
} from '@mui/material/Autocomplete'
import type {
  ReactNode,
  FocusEvent,
  KeyboardEvent,
  CSSProperties,
  ComponentProps,
  MutableRefObject,
} from 'react'
import type {
  TAutoOpt,
  TAutoOptVal,
  TInputDecor,
  TOnAutoChange,
} from '@GBC/types'

import { Decor } from './Decor'
import { useCallback, useRef } from 'react'
import { useInputRef } from '@GBC/hooks/form/useInputRef'

import { InputLabel } from './InputLabel'
import { emptyObj, isStr, cls } from '@keg-hub/jsutils'
import { useInline } from '@GBC/hooks/components/useInline'
import CircularProgress from '@mui/material/CircularProgress'
import {
  Checkbox,
  TextFieldProps,
} from '@mui/material'
import {
  Auto,
  AutoContainer,
  AutoTextInput,
  AutoInputControl,
  AutoInputContainer,
} from './Inputs.styled'

export type TAutoInput = {
  id?:string
  name?: string
  error?:string
  freeSolo?:boolean
  matchId?: boolean
  className?:string
  loading?: boolean
  sx?:CSSProperties
  value?:TAutoOptVal
  autoFocus?:boolean
  required?: boolean
  multiple?: boolean
  labelSide?:boolean
  disabled?: boolean
  decor?: TInputDecor
  placeholder?:string
  labelInline?:boolean
  helperText?:ReactNode
  showCheckbox?: boolean
  options?: TAutoOptVal[]
  labelSx?: CSSProperties
  helperSx?: CSSProperties
  onChange?: TOnAutoChange
  currentValue?:TAutoOptVal
  defaultValue?:TAutoOptVal
  labelWrapSx?: CSSProperties
  rules?: Record<string, string>
  label?: TextFieldProps['label']
  helperTextProps?:FormHelperTextProps
  variant?:`outlined`|`filled`|`standard`
  FormHelperTextProps?:FormHelperTextProps
  onBlur?: (event:any, ...args:any[]) => void
  autocompleteProps?: Partial<ComponentProps<typeof Auto>>
  color?: `primary`|`secondary`|`error`|`info`|`success`|`warning`
  textFieldProps?: Omit<TextFieldProps, 'name' | 'required' | 'label'>
  inputRef?:MutableRefObject<HTMLInputElement | HTMLTextAreaElement | undefined>
}

const useOnChangeVal = (
  props:TAutoInput,
  inputRef:MutableRefObject<HTMLInputElement | HTMLTextAreaElement | undefined>,
  fromChangeRef:MutableRefObject<boolean>,
  onBlur: (evt: FocusEvent<HTMLInputElement>) => void,
) => {
  
  const {
    matchId,
    onChange,
    freeSolo,
    autocompleteProps
  } = props
  
  return useCallback((
    evt:any,
    value:TAutoOptVal,
    reason:AutocompleteChangeReason,
    details:AutocompleteChangeDetails
  ) => {

    // If in freeSolo, and there's a select option change
    // And no onChange exists, we still want to capture the select option value
    if(freeSolo && !onChange && !autocompleteProps?.onChange){
      if(reason === `selectOption` && onBlur || autocompleteProps?.onBlur){
        const event = {
          ...evt,
          target: {
            tagName: `INPUT`,
            value: isStr(value) ? value : value.id
          }
        }

        onBlur?.(event)
        fromChangeRef.current = true
        inputRef?.current?.blur?.()
      }
      else {
        evt?.stopPropagation?.()
        evt?.preventDefault?.()
      }

      return undefined
    }
    
    let changedVal:TAutoOptVal|TAutoOptVal[] = value

    if (matchId)
      changedVal = Array.isArray(value)
        ? value.map((i: any) => i?.id || i) as TAutoOptVal[]
        : ((value as TAutoOpt)?.id || value) as TAutoOptVal

    onChange?.(evt, changedVal, reason, details)
    if (autocompleteProps?.onChange)
      autocompleteProps?.onChange?.(evt, value, reason, details)
  }, [
    onBlur,
    matchId,
    onChange,
    autocompleteProps?.onChange
  ])
}

const useOnBlur = (
  props:TAutoInput,
  fromChangeRef:MutableRefObject<boolean>
) => {
  
  const {
    onBlur,
    freeSolo,
    autocompleteProps,
  } = props
  
  return useCallback((evt:FocusEvent<HTMLInputElement>) => {
    
    // Bypass the onblur method call
    // Because it was already called by on Change
    if(fromChangeRef.current){
      fromChangeRef.current = false
      evt?.stopPropagation?.()
      evt?.preventDefault?.()
      return undefined
    }
    
    onBlur?.(evt)
    autocompleteProps?.onBlur?.(evt)

  }, [
    onBlur,
    freeSolo,
    autocompleteProps,
  ])
  
}

const AutoInputComp = (props:TAutoInput) => {
  const {
    id,
    sx,
    name,
    label,
    rules,
    error,
    color,
    value,
    onBlur,
    variant,
    loading,
    labelSx,
    multiple,
    required,
    freeSolo,
    disabled,
    helperSx,
    autoFocus,
    className,
    labelSide,
    options=[],
    helperText,
    labelInline,
    placeholder,
    labelWrapSx,
    showCheckbox,
    defaultValue,
    textFieldProps,
    helperTextProps,
    autocompleteProps,
    currentValue=value,
    FormHelperTextProps,
    decor=emptyObj as TInputDecor,
    ...rest
  } = props

  const inputRef = useInputRef(props)
  const fromChangeRef = useRef<boolean>(false)
  const onBlurCB = useOnBlur(props, fromChangeRef)
  const onChangeVal = useOnChangeVal(
    props,
    inputRef,
    fromChangeRef,
    onBlurCB,
  )
  
  const { Component:DecorComponent, decorPos=`start` } = decor
  const decorKey = decorPos === `end` ? `endAdornment` : `startAdornment`

  const onKeyDown = useInline((evt:KeyboardEvent) => {
    const evtKey = evt as Record<`key`, string> 
    if(evtKey.key !== `Enter`) return

    const target = evt?.target as HTMLInputElement
    const value = target?.value
    onChangeVal(
      evt,
      value,
      `selectOption`,
      { option: value }
    )
    target?.blur?.()
  })

  return (
      <Auto
        {...autocompleteProps}
        sx={sx}
        loading={loading}
        options={options}
        freeSolo={freeSolo}
        disabled={disabled}
        multiple={multiple}
        value={currentValue || null}
        defaultValue={defaultValue}
        onChange={onChangeVal as any}
        className={cls(
          className,
          `gb-auto-complete`,
          labelSide ? `gb-auto-input-side` : `gb-auto-input`
        )}
        disableCloseOnSelect={
          typeof autocompleteProps?.disableCloseOnSelect === 'boolean'
            ? autocompleteProps.disableCloseOnSelect
            : !!multiple
        }
        isOptionEqualToValue={
          autocompleteProps?.isOptionEqualToValue
            ? autocompleteProps.isOptionEqualToValue
            : ((option:TAutoOptVal, value:TAutoOptVal) => {
                const opVal = isStr(option) ? option : option.id
                const val = value && (isStr(value) ? value : value.id)

                return value ? opVal === val : false
              }) as any
        }
        getOptionLabel={
          autocompleteProps?.getOptionLabel
            ? autocompleteProps.getOptionLabel
            : ((option:TAutoOptVal) => isStr(option) ? option : option?.label) as any
        }
        renderOption={(
          autocompleteProps?.renderOption ?? (
            showCheckbox
              ? (props:ComponentProps<`li`>, option:TAutoOptVal, { selected }:Record<`selected`, boolean>) => (
                  <li {...props}>
                    <>
                      <Checkbox
                        sx={{marginRight: 1}}
                        checked={selected}
                      />
                      {autocompleteProps?.getOptionLabel?.(option) || (option as TAutoOpt)?.label || option}
                    </>
                  </li>
                )
              : undefined
        )) as any}
        onBlur={onBlurCB}
        renderInput={(params) => {
          return (
            <AutoTextInput
              name={name}
              required={rules?.required ? true : required}
              label={labelInline && label ? label : undefined}
              {...textFieldProps}
              {...params}
              className={cls(
                `gb-auto-input-text`,
                labelSide && `gb-auto-input-text-side`
              )}
              error={!!error}
              variant={variant}
              id={params.id || id}
              placeholder={placeholder || "Select an option..."}
              helperText={
                error
                  ? error
                  : helperText || textFieldProps?.helperText || ` `
              }
              FormHelperTextProps={{
                ...FormHelperTextProps,
                ...helperTextProps,
                sx: [
                  FormHelperTextProps?.sx,
                  helperTextProps?.sx,
                  helperSx
                ] as CSSProperties[]
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20}/> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
                ...(DecorComponent && {
                  [decorKey]: (
                    <Decor
                      {...decor}
                      Component={DecorComponent}
                    />
                  )
                }),
                ...textFieldProps?.InputProps,
                inputRef: inputRef
              }}
              inputProps={{
                ...params.inputProps,
                ...textFieldProps?.inputProps,
                onKeyDown: onKeyDown,
              }}
              InputLabelProps={{
                shrink: true,
                ...textFieldProps?.InputLabelProps,
                ...params.InputLabelProps,
              }}
            />
          )
        }}
        {...rest}
      />
  )
}


export const AutoInput = (props:TAutoInput) => {
  const {
    id,
    label,
    labelSx,
    labelSide,
    labelWrapSx,
    labelInline,
  } = props

  return (
    <AutoContainer
      className={cls(
        `gb-auto-input-root`,
        `gb-auto-input-container`,
        labelSide && `gb-auto-input-container-side`
      )}
    >
      {
        !labelSide
          ? (
              <>
                <InputLabel
                  id={id}
                  label={label}
                  labelSx={labelSx}
                  labelSide={labelSide}
                  labelWrapSx={labelWrapSx}
                  labelInline={labelInline}
                />
                <AutoInputComp {...props} />
              </>
            )
          : (
              <AutoInputControl className={cls(labelSide && `gb-auto-input-control-side`)}>
                <AutoInputContainer>
                  <InputLabel
                    id={id}
                    label={label}
                    labelSx={labelSx}
                    labelSide={labelSide}
                    labelWrapSx={labelWrapSx}
                    labelInline={labelInline}
                  />
                  <AutoInputComp {...props} />
                </AutoInputContainer>
              </AutoInputControl>
            )
      }
    </AutoContainer>
  )
  
}
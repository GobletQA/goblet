import type { TInputDecor } from '@GBC/types'
import type { TInputLabel } from './InputLabel'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { ComponentProps, ReactNode, CSSProperties, RefObject } from 'react'

import { Decor } from './Decor'
import { InputLabel } from './InputLabel'
import {cls, emptyObj, isArr, isObj} from '@keg-hub/jsutils'
import {MenuProps} from '@mui/material/Menu/Menu'
import { useDecor } from '@GBC/hooks/form/useDecor'
import { useLabelId } from '@GBC/hooks/form/useLabelId'
import { useInline } from '@GBC/hooks/components/useInline'
import {FormHelperTextProps} from '@mui/material/FormHelperText/FormHelperText'
import {
  Option,
  SelectComp,
  HelperText,
  SelectContainer
} from './Select.styled'


export type TSelectOption = {
  id?:string
  text:ReactNode
  divider?:boolean
  sx?:CSSProperties
  className?:string
  selected?:boolean
  value?:string|number
}

export type TSelect = TInputLabel & Pick<ComponentProps<typeof SelectComp>, `inputProps`> & {
  error?:ReactNode
  className?:string
  labelClass?:string
  required?:boolean
  disabled?:boolean
  multiple?:boolean
  decor?:TInputDecor
  fullWidth?:boolean
  autoWidth?:boolean
  helperClass?:string
  value?:string|number
  MenuProps?:MenuProps
  helperText?:ReactNode
  selectSx?:CSSProperties
  labelSx?:CSSProperties
  containerClass?:string
  helperSx?: CSSProperties
  containerSx?:CSSProperties
  size?:`small`|`medium`|string
  helperTextProps?:FormHelperTextProps
  variant?:`filled`|`outlined`|`standard`
  options:string[]|number[]|TSelectOption[]
  selectRef?:RefObject<HTMLSelectElement | undefined>
  onChange?:(evt:SelectChangeEvent<any>, child?:ReactNode) => void
}

export const Select = (props:TSelect) => {

  const {
    id,
    error,
    label,
    labelSx,
    variant,
    disabled,
    required,
    helperSx,
    selectSx,
    className,
    multiple,
    labelSide,
    autoWidth,
    selectRef,
    MenuProps,
    labelClass,
    helperText,
    inputProps,
    labelInline,
    helperClass,
    labelWrapSx,
    options=[],
    containerSx,
    value:selectVal,
    fullWidth=true,
    containerClass,
  } = props
  
  const labelId = useLabelId(props)
  const onChange = useInline(props.onChange)
  const bottomText = error ? error : helperText || ` `

  const { decorProps, decorKey } = useDecor(props)


  return (
    <SelectContainer
      sx={containerSx}
      variant={variant}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      error={Boolean(error)}
      className={cls(
        containerClass,
        `gb-select-root`,
        `gb-select-container`,
        labelSide && `gb-select-container-side`
      )}
    >

      <InputLabel
        id={id}
        label={label}
        labelSx={labelSx}
        labelId={labelId}
        labelSide={labelSide}
        labelClass={labelClass}
        labelInline={labelInline}
        labelWrapSx={labelWrapSx}
      />

      <SelectComp
        id={id}
        label={label}
        sx={selectSx}
        ref={selectRef}
        variant={variant}
        value={selectVal}
        labelId={labelId}
        multiple={multiple}
        disabled={disabled}
        required={required}
        onChange={onChange}
        MenuProps={MenuProps}
        autoWidth={autoWidth}
        className={className}
        inputProps={inputProps}
        {...(decorProps && { [decorKey]: (<Decor {...decorProps} />) })}
      >
        {options.map(opt => {
          const {
            sx,
            id,
            text,
            value,
            divider,
            selected,
            className,
          } = (isObj(opt) ? opt : { id: opt, value: opt, text: opt } as any)
          
          const isSelected = selected
            || (
                selectVal
                  ? isArr(selectVal)
                    ? selectVal.includes(value)
                    : value === selectVal
                  : false
                )

          return (
            <Option
              sx={sx}
              id={id}
              divider={divider}
              selected={isSelected}
              className={className}
              key={id || value || text}
              value={value || text ? `${text}` : ``}
            >
              {text}
            </Option>
          )
        })}
      </SelectComp>
      <HelperText
        sx={helperSx}
        className={helperClass}
      >
        {bottomText}
      </HelperText>
    </SelectContainer>
  )


}
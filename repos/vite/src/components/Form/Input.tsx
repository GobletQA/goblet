import type { ReactNode, ComponentProps } from 'react'
import { useMemo } from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import InputLabel from '@mui/material/InputLabel'
import MuiTextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'


export type THelperText = ComponentProps<typeof FormHelperText> & {
  HelperText: ReactNode
}


export type TInputLabel = ComponentProps<typeof InputLabel> & {
  label?: string
  Label: ReactNode
}

export type TText = ComponentProps<typeof MuiTextField> & {
  label?: string
  Label?: ReactNode
  children: ReactNode
  HelperText?: ReactNode
  labelProps?: TInputLabel
  helperProps?: THelperText
  width?: `full` | `half` | `quarter` | `third` | string | number
}

const widthMap:Record<string, string> = {
  ['75']: `75%`,
  half: `50%`,
  ['50']: `50%`,
  third: `33.3333%`,
  ['33']: `33.3333%`,
  quarter: `25%`,
  ['25']: `25%`,
}

const useResolvedProps = (props:TText) => {
  const {
    sx,
    width,
    fullWidth,
  } = props
  
  return useMemo(() => {
    return fullWidth || width === `full`
      ? { fullWidth: true }
      : width
        ? { sx: [sx, { width: widthMap[width] || width }] }
        : noOpObj
  }, [
    sx,
    width,
    fullWidth,
  ]) as Partial<TText>
}

export const Input = (props:TText) => {
  const {
    label,
    Label,
    labelProps,
    HelperText,
    helperProps,
    ...rest
  } = props

  const resolved = useResolvedProps(props)

  return (
    <MuiTextField
      margin='normal'
      label={Label || label}
      helperText={HelperText}
      InputLabelProps={labelProps}
      FormHelperTextProps={helperProps}
      {...rest}
      {...resolved}
    />
  )
}

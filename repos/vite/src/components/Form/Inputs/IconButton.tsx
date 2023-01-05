import type { CSSObj } from '@types'
import type { IconButtonProps } from '@mui/material'
import type { ElementType, ComponentType } from 'react'
import type { SvgIconProps } from '@mui/material/SvgIcon'

import Box from '@mui/material/Box'
import { noOpObj } from '@keg-hub/jsutils'
import { useLabelProps } from './inputHooks'
import FormLabel from '@mui/material/FormLabel'
import MuiIconBtn from '@mui/material/IconButton'
import { useJoinSx } from '@hooks/theme/useJoinSx'

export type TIconButton = IconButtonProps & {
  error?:boolean
  filled?:boolean
  focused?:boolean
  active?: boolean
  onColor?: string
  offColor?: string
  onProps?: SvgIconProps
  offProps?: SvgIconProps
  iconProps?: SvgIconProps
  onSx?: CSSObj
  offSx?: CSSObj
  labelSx?: CSSObj
  Icon?: ComponentType<any>
  OnIcon?: ComponentType<any>
  OffIcon?: ComponentType<any>
  buttonProps?: IconButtonProps
  component?:ElementType<any>
  label?:string
  labelPos?:`top`|`bottom`|`start`|`end`
  labelPlacement?:`top`|`bottom`|`start`|`end`
}

type TBtnLabelProps = TIconButton & {
  label?:string
  labelPlacement?:string
}

const defStyles = {
  container: {
    top: `-5px`,
    display: `flex`,
    minWidth: `55px`,
    maxWidth: `55px`,
    position: `relative`,
    justifyContent: `center`
  },
  labelTop: {
    bottom: `35px`,
    fontSize: `10px`,
    position: `absolute`
  },
  labelBottom: {
    top: `35px`,
    fontSize: `10px`,
    position: `absolute`
  }
}

const ButtonLabel = (props:TBtnLabelProps) => {
  const {
    sx,
    color,
    error,
    filled,
    focused,
    children,
    disabled,
    component
  } = props

  return (
    <FormLabel
      sx={sx}
      error={error}
      filled={filled}
      focused={focused}
      disabled={disabled}
      children={children}
      color={color as any}
      component={component || `span`}
    />
  )
}

export const IconButton = (props:TIconButton) => {

  const {
    onSx,
    offSx,
    active,
    labelSx,
    children,
    onClick,
    onBlur,
    onFocus,
    onMouseUp,
    onMouseDown,
    onMouseOut,
    onMouseOver,
    labelPos,
    onColor='primary',
    offColor='disabled',
    buttonProps=noOpObj as IconButtonProps,
    onProps,
    offProps,
    iconProps=onProps || offProps,
    OnIcon,
    OffIcon,
    Icon=OnIcon || OffIcon,
    ...rest
  } = props

  const {
    label,
    labelPlacement,
    ...mergedProps
  } = useLabelProps<TBtnLabelProps>(props)

  const topSx = useJoinSx(defStyles.labelTop, mergedProps.sx as CSSObj)
  const bottomSx = useJoinSx(defStyles.labelBottom, mergedProps.sx as CSSObj)

  return (
    <Box
      className='goblet-form-icon-button-container'
      sx={[
        ((label ? defStyles.container : noOpObj) as CSSObj),
      ]}
    >
      <MuiIconBtn
        className='goblet-form-icon-button'
        {...mergedProps}
        {...rest}
        onBlur={onBlur}
        onFocus={onFocus}
        onClick={onClick}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
      >
        {label && labelPlacement === `top` && (
          <ButtonLabel
          className='goblet-form-icon-button-label goblet-form-icon-button-label-top'
          {...mergedProps}
          {...rest}
          sx={topSx}
          >
            {label}
          </ButtonLabel>
        )}
        {Icon ? <Icon className='goblet-form-icon-button-icon' {...iconProps} /> : children}
        {label && labelPlacement !== `top` && (
          <ButtonLabel
            className='goblet-form-icon-button-label goblet-form-icon-button-label-bottom'
            {...mergedProps}
            {...rest}
            sx={bottomSx}
          >
            {label}
          </ButtonLabel>
        )}
      </MuiIconBtn>
    </Box>
  )
}
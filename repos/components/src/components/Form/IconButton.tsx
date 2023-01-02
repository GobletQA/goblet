import type { IconButtonProps } from '@mui/material'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import type { CSSProperties, ElementType, ComponentType, ReactNode } from 'react'

import { Fragment } from 'react'
import { emptyObj } from '@keg-hub/jsutils'
import { useLabelProps } from './inputHooks'
import { Tooltip } from '@GBC/components/Tooltip'
import { useJoinSx } from '@GBC/hooks/theme/useJoinSx'
import { IconBtnContainer, IconBtn, IconBtnLabel } from './Form.styled'


export type TIconButton = IconButtonProps & {
  label?:string
  tooltip?:string
  
  error?:boolean
  filled?:boolean
  focused?:boolean
  active?: boolean
  onColor?: string
  offColor?: string
  className?:string
  onSx?: CSSProperties
  offSx?: CSSProperties
  iconSx?: CSSProperties
  labelSx?: CSSProperties
  tooltipSx?:CSSProperties
  containerSx?:CSSProperties
  onProps?: SvgIconProps
  offProps?: SvgIconProps
  iconProps?: SvgIconProps
  Icon?: ComponentType<any>
  OnIcon?: ComponentType<any>
  component?:ElementType<any>
  OffIcon?: ComponentType<any>
  buttonProps?: IconButtonProps
  tooltipPos?:`top`|`bottom`|`start`|`end`
  labelPos?:`top`|`bottom`|`start`|`end`
  labelPlacement?:`top`|`bottom`|`start`|`end`
}

type TBtnLabelProps = TIconButton & {
  label?:string
  labelPlacement?:string
}

const defStyles:Record<string, CSSProperties> = {
  container: {
    top: `-5px`,
    display: `flex`,
    minWidth: `55px`,
    maxWidth: `55px`,
    position: `relative`,
    justifyContent: `center`
  },
  labelTop: {
    bottom: `28px`,
    fontSize: `10px`,
    position: `absolute`
  },
  labelBottom: {
    top: `28px`,
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
    <IconBtnLabel
      sx={sx}
      error={error}
      filled={filled}
      focused={focused}
      disabled={disabled}
      children={children}
      color={color as any}
      // @ts-ignore
      component={component || `span`}
    />
  )
}

export const IconButton = (props:TIconButton) => {

  const {
    sx,
    onSx,
    offSx,
    active,
    iconSx,
    labelSx,
    tooltipSx,
    containerSx,
    children,
    tooltip,
    onClick,
    onBlur,
    onFocus,
    onMouseUp,
    onMouseDown,
    onMouseOut,
    onMouseOver,
    tooltipPos,
    labelPos,
    onProps,
    offProps,
    OnIcon,
    OffIcon,
    onColor='primary',
    offColor='disabled',
    Icon=active ? OnIcon : OffIcon,
    color=active ? onColor : offColor,
    iconProps=active ? onProps : offProps,
    buttonProps=emptyObj as IconButtonProps,
    ...rest
  } = props

  const {
    label,
    labelPlacement,
    ...mergedProps
  } = useLabelProps<TBtnLabelProps>(props)

  const topSx = useJoinSx(defStyles.labelTop, mergedProps.sx as CSSProperties)
  const bottomSx = useJoinSx(defStyles.labelBottom, mergedProps.sx as CSSProperties)
  const ToolWrap = tooltip ? Tooltip : Fragment
  const toolProps = tooltip
    ? { loc: tooltipPos, title: tooltip, sx: tooltipSx }
    : emptyObj

  return (
    <IconBtnContainer
      sx={[
        ((label ? defStyles.container : emptyObj) as CSSProperties),
        containerSx as CSSProperties
      ]}
    >
    <ToolWrap {...toolProps as any} >
      <IconBtn
        {...mergedProps}
        {...rest}
        sx={[
          sx as CSSProperties,
          (active ? onSx : offSx) as CSSProperties
        ]}
        onBlur={onBlur}
        onFocus={onFocus}
        onClick={onClick}
        color={color as any}
        onMouseUp={onMouseUp}
        onMouseOut={onMouseOut}
        onMouseDown={onMouseDown}
        onMouseOver={onMouseOver}
      >
        {label && labelPlacement === `top` && (
          <ButtonLabel
          {...mergedProps}
          {...rest}
          sx={topSx}
          >
            {label}
          </ButtonLabel>
        )}
        {
          Icon
            ? (<Icon {...iconProps} sx={[iconSx, iconProps?.sx]} />)
            : children
        }
        {label && labelPlacement !== `top` && (
          <ButtonLabel
            {...mergedProps}
            {...rest}
            sx={bottomSx}
          >
            {label}
          </ButtonLabel>
        )}
      </IconBtn>
    </ToolWrap>
    </IconBtnContainer>
  )
}
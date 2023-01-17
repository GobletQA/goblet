import type { TColorType } from '@GBC/types'
import type { CSSProperties, ComponentType, ReactNode } from 'react'
import type { TooltipProps } from '@mui/material/Tooltip'

import { useMemo } from 'react'
import { Container } from './BaseAction.styled'
import { Tooltip } from '@GBC/components/Tooltip'
import { IconButton, Button } from '@GBC/components/Buttons'
import { cls, isStr, noOpObj } from '@keg-hub/jsutils'

export type TBaseActionAction = {
  text?:ReactNode
  tooltip:string
  fontSize?:string
  disabled?:boolean
  className?:string
  sx?:CSSProperties
  color?:TColorType
  enterDelay?:number
  as?:`button`|`icon`
  children?:ReactNode
  textSx?:CSSProperties
  iconSx?:CSSProperties
  actionClassName?:string
  disabledTooltip?:string
  Icon?:ComponentType<any>
  loc?:TooltipProps['placement']
  onClick?:(...args:any[]) => any
  variant?:`contained`|`outlined`|`text`
}

const useToolTipText = (props:TBaseActionAction) => {
  const {
    tooltip,
    disabled,
    disabledTooltip
  } = props

  return useMemo(() => {
    return !disabled
      ? tooltip
      : isStr(disabledTooltip)
        ? disabledTooltip
        : isStr(tooltip)
          ? `DISABLED - ${tooltip}`
          : tooltip
  }, [
    tooltip,
    disabled,
    disabledTooltip
  ])
}

const useDisabledStyle = (disabled?:boolean) => {
  return useMemo(() => {
    return disabled
      ? {box: { cursor: disabled ? `not-allowed` : `auto` }}
      : noOpObj as Record<string, any>
  }, [disabled])
}

export const BaseAction = (props:TBaseActionAction) => {
  const {
    Icon,
    text,
    onClick,
    tooltip,
    disabled,
    children,
    as=`icon`,
    className,
    loc=`right`,
    enterDelay=500,
    fontSize=`12px`,
    actionClassName,
    disabledTooltip,
    ...rest
  } = props

  const title = useToolTipText(props)
  const style = useDisabledStyle(disabled)

  return (
    <Tooltip
      loc={loc}
      describeChild
      title={title}
      fontSize={fontSize}
      enterDelay={enterDelay}
    >
      <Container
        sx={style?.box}
        className={cls(
          `goblet-editor-action`,
          className as string
          
        )}
      >
      {as !== `icon`
        ? (
            <Button
              Icon={Icon}
              text={text}
              onClick={onClick}
              disabled={disabled}
              children={children}
              className={actionClassName}
              {...rest}
            />
          )
        : (
            <IconButton
              Icon={Icon}
              onClick={onClick}
              disabled={disabled}
              children={children}
              className={actionClassName}
              {...rest}
            />
          )
        }
      
      </Container>
    </Tooltip>
  )
  
}
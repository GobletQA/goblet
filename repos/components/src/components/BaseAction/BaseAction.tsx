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
  enterDelay?:number
  as?:`button`|`icon`
  children?:ReactNode
  textSx?:CSSProperties
  iconSx?:CSSProperties
  disabledTooltip?:string
  Icon?:ComponentType<any>
  loc?:TooltipProps['placement']
  onClick?:(...args:any[]) => any
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
    disabled,
    children,
    as=`icon`,
    className,
    loc=`right`,
    enterDelay=500,
    fontSize=`12px`,
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
        className={cls('goblet-editor-action', className as string)}
      >
      {as !== `icon`
        ? (
            <Button
              Icon={Icon}
              text={text}
              onClick={onClick}
              disabled={disabled}
              children={children}
            />
          )
        : (
            <IconButton
              Icon={Icon}
              onClick={onClick}
              disabled={disabled}
              children={children}
            />
          )
        }
      
      </Container>
    </Tooltip>
  )
  
}
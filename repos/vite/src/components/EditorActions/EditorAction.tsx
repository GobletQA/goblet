import type { TooltipProps } from '@mui/material/Tooltip'
import type { ComponentType } from 'react'

import { useMemo } from 'react'
import Box from '@mui/material/Box'
import { cls, isStr, noOpObj } from '@keg-hub/jsutils'
import { IconButton, Tooltip, useTheme } from '@gobletqa/components'

export type TEditorActionProps = {
  loc?:TooltipProps['placement']
  tooltip:string
  fontSize?:string
  disabled?:boolean
  className?:string
  enterDelay?:number
  disabledTooltip?:string
  Icon:ComponentType<any>
  onClick?:(...args:any[]) => any
}

const useToolTipText = (props:TEditorActionProps) => {
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
  const theme = useTheme()
  return useMemo(() => {
    return disabled
      ? {box: { cursor: disabled ? `not-allowed` : `auto` }}
      : noOpObj as Record<string, any>
  }, [disabled, theme])
}

export const EditorAction = (props:TEditorActionProps) => {
  const {
    Icon,
    onClick,
    disabled,
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
      <Box
        sx={style?.box}
        className={cls('goblet-editor-action', className as any)}
      >
        <IconButton
          Icon={Icon}
          onClick={onClick}
          disabled={disabled}
        />
      </Box>
    </Tooltip>
  )
  
}
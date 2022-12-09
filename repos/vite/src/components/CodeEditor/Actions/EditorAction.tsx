import type { TooltipProps } from '@mui/material/Tooltip'
import type { ComponentType } from 'react'

import { useMemo } from 'react'
import Box from '@mui/material/Box'
import { Tooltip } from '@components/Tooltip'
import { useTheme } from '@hooks/theme/useTheme'
import { IconButton } from '@components/Buttons'
import { cls, isStr, noOpObj } from '@keg-hub/jsutils'

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
      ? {
          box: { cursor: disabled ? `not-allowed` : `auto` },
          // TODO: Not really a fan of needing !important
          // This is the easiest quick-fix / work-around
          btn: { color: `${theme?.palette?.colors?.fadeLight30} !important` }
        }
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
        className={cls('goblet-editor-action', className)}
      >
        <IconButton
          Icon={Icon}
          onClick={onClick}
          sx={style?.btn}
          disabled={disabled}
        />
      </Box>
    </Tooltip>
  )
  
}